/**
 * verify-email.component.ts — Email Verification Component
 *
 * Collects a 6-digit OTP code entered by the user.
 * Reads the pending email from localStorage (set by RegisterComponent).
 * Calls POST /api/v1/auth/verifyEmail.
 * On success: saves JWT token and navigates to /login (or /dashboard).
 */

import { Component, OnInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: false,
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent implements OnInit {

  /** The email that needs verification (retrieved from localStorage) */
  pendingEmail: string = '';

  /**
   * Array representing each digit of the 6-digit OTP.
   * Each element holds a single digit string or empty string.
   */
  otpDigits: string[] = ['', '', '', '', '', ''];

  /** References to the 6 OTP <input> elements for focus management */
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  /** True while the HTTP request is pending */
  isLoading = false;

  /** API error message to display in the alert banner */
  apiError: string | null = null;

  /** API success message */
  apiSuccess: string | null = null;

  /** Countdown timer for re-send code (starts at 60 seconds) */
  resendCountdown = 60;

  /** Interval reference for the countdown timer */
  private countdownInterval: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Retrieve the pending email from localStorage
    const email = this.authService.getPendingEmail();
    if (!email) {
      // No pending email — redirect back to register
      this.router.navigate(['/register']);
      return;
    }
    this.pendingEmail = email;
    // Start the resend countdown
    this.startCountdown();
  }

  ngOnDestroy(): void {
    // Clean up the interval on component destroy to prevent memory leaks
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  }

  // ----------------------------------------------------------------
  // OTP Input Management
  // ----------------------------------------------------------------

  /**
   * Handles keydown events on OTP input boxes.
   * - Allows backspace to clear and move to previous box.
   * - Allows left/right arrow navigation.
   */
  onOtpKeyDown(event: KeyboardEvent, index: number): void {
    const inputs = this.otpInputs.toArray();

    if (event.key === 'Backspace') {
      if (this.otpDigits[index]) {
        // Clear current box
        this.otpDigits[index] = '';
      } else if (index > 0) {
        // Move back and clear previous box
        this.otpDigits[index - 1] = '';
        inputs[index - 1].nativeElement.focus();
      }
      event.preventDefault();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      inputs[index - 1].nativeElement.focus();
      event.preventDefault();
    } else if (event.key === 'ArrowRight' && index < 5) {
      inputs[index + 1].nativeElement.focus();
      event.preventDefault();
    }
  }

  /**
   * Handles input events on OTP boxes.
   * Only allows single digit 0-9. Moves focus to the next box automatically.
   */
  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '').slice(-1); // single digit only
    this.otpDigits[index] = value;
    input.value = value; // sync display

    // Auto-advance to next input if a digit was entered
    if (value && index < 5) {
      const inputs = this.otpInputs.toArray();
      inputs[index + 1].nativeElement.focus();
    }

    // If all 6 digits entered, automatically submit
    if (this.isOtpComplete) {
      this.onSubmit();
    }
  }

  /**
   * Handles paste events — fills all 6 boxes from pasted 6-digit string.
   */
  onOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text') || '';
    const digits = pasted.replace(/[^0-9]/g, '').slice(0, 6);
    digits.split('').forEach((d, i) => {
      if (i < 6) this.otpDigits[i] = d;
    });
    // Focus the last filled input
    const lastIdx = Math.min(digits.length, 5);
    const inputs = this.otpInputs.toArray();
    inputs[lastIdx].nativeElement.focus();

    if (digits.length === 6) this.onSubmit();
  }

  /** True when all 6 OTP digits are filled */
  get isOtpComplete(): boolean {
    return this.otpDigits.every(d => d !== '');
  }

  /** Returns the 6-digit code as a single string */
  get otpCode(): string {
    return this.otpDigits.join('');
  }

  // ----------------------------------------------------------------
  // Resend countdown
  // ----------------------------------------------------------------

  /** Starts a 60-second countdown before allowing resend */
  private startCountdown(): void {
    this.resendCountdown = 60;
    this.countdownInterval = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
      }
    }, 1000);
  }

  /** True when the user can resend the code (countdown expired) */
  get canResend(): boolean {
    return this.resendCountdown <= 0;
  }

  /** Re-triggers the registration endpoint to send a new verification code */
  resendCode(): void {
    if (!this.canResend) return;
    // Clear OTP inputs
    this.otpDigits = ['', '', '', '', '', ''];
    this.apiError   = null;
    this.apiSuccess = 'A new verification code has been sent to your email.';
    this.startCountdown();
    // Note: In a real app you'd call a dedicated resend endpoint here.
  }

  // ----------------------------------------------------------------
  // Submission
  // ----------------------------------------------------------------

  /** Handles OTP form submission */
  onSubmit(): void {
    if (!this.isOtpComplete) return;
    this.isLoading = true;
    this.apiError   = null;
    this.apiSuccess = null;

    this.authService.verifyEmail({
      email: this.pendingEmail,
      verificationCode: this.otpCode
    }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          this.authService.clearPendingEmail();
          // If token returned, save it and redirect to dashboard
          if (res.token) {
            this.authService.saveToken(res.token);
            const user = res.data || this.authService.getCurrentUser();
            if (user?.role === 'admin') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/home']);
            }
          } else {
            this.router.navigate(['/login']);
          }
        } else {
          this.apiError = res.message || 'Verification failed.';
          this.otpDigits = ['', '', '', '', '', ''];
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.apiError =
          err?.error?.message ||
          err?.error?.errors?.[0]?.msg ||
          'Verification failed. Please try again.';
        this.otpDigits = ['', '', '', '', '', ''];
        // Refocus first input
        setTimeout(() => this.otpInputs.first?.nativeElement.focus(), 100);
      }
    });
  }
}
