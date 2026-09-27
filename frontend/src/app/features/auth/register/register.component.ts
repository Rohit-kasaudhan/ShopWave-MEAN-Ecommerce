/**
 * register.component.ts — User Registration Component
 *
 * Collects: FirstName, LastName, email, phone (indian format),
 *           password, confirmPassword, birthDate, gender.
 *
 * On successful POST to /api/v1/auth/register:
 *  - Displays 'Registered successfully' message
 *  - Resets registration form
 *
 * Validation:
 *  - All fields required
 *  - Phone: indian mobile format (9/8/7/6 + 9 digits)
 *  - Password: min 6 chars, at least one uppercase and one lowercase
 *  - confirmPassword must match password
 *  - Client-side password strength meter
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

// Custom validator: password must have at least one uppercase and one lowercase letter
function passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value || '';
  if (!value) return null; // required validator handles empty
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  if (!hasUpper || !hasLower) {
    return { passwordStrength: true };
  }
  return null;
}

// Cross-field validator: confirmPassword must match password
function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm  = group.get('confirmPassword')?.value;
  if (confirm && password !== confirm) {
    return { passwordsMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register',  // Used in routing — not directly in templates
  standalone: false,         // Module-based (AppModule declares this)
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  /** The reactive form group for the registration form */
  registerForm!: FormGroup;

  /** Loading state — true while the HTTP request is in flight */
  isLoading = false;

  /** API error message to display in the alert banner */
  apiError: string | null = null;

  /** API success message (if any unexpected success msg comes back) */
  apiSuccess: string | null = null;

  /** Whether the password field is shown as plain text */
  showPassword = false;

  /** Whether the confirmPassword field is shown as plain text */
  showConfirmPassword = false;

  /** Password strength: 0=empty, 1=weak, 2=medium, 3=strong */
  passwordStrength = 0;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
    // Watch password changes to update strength meter
    this.registerForm.get('password')?.valueChanges.subscribe(value => {
      this.updatePasswordStrength(value);
    });
  }

  /** Builds the reactive form with validators matching the backend rules */
  private buildForm(): void {
    this.registerForm = this.fb.group({
      FirstName: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
      ],
      LastName: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
      ],
      email: [
        '',
        [Validators.required, Validators.email]
      ],
      phone: [
        '',
        [
          Validators.required,
          // indian mobile numbers: 9,8,7, or 6 followed by 9 digits
          Validators.pattern(/^[6-9][0-9]{9}$/)
        ]
      ],
      password: [
        '',
        [Validators.required, Validators.minLength(6), passwordStrengthValidator]
      ],
      confirmPassword: [
        '',
        [Validators.required]
      ],
      birthDate: [
        '',
        [Validators.required]
      ],
      gender: [
        '',
        [Validators.required]
      ]
    },
    // Group-level validator for password matching
    { validators: passwordsMatchValidator }
    );
  }

  /**
   * Computes password strength score based on character types present.
   * 0 = empty, 1 = weak, 2 = medium, 3 = strong
   */
  updatePasswordStrength(value: string): void {
    if (!value) { this.passwordStrength = 0; return; }
    let score = 0;
    if (value.length >= 6)  score++;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
    if (/[0-9]/.test(value) || /[^a-zA-Z0-9]/.test(value)) score++;
    this.passwordStrength = score;
  }

  /** Returns CSS class for each strength bar segment */
  getStrengthClass(index: number): string {
    if (this.passwordStrength === 0) return '';
    if (this.passwordStrength === 1 && index === 0) return 'active-weak';
    if (this.passwordStrength === 2 && index <= 1) return 'active-medium';
    if (this.passwordStrength === 3) return 'active-strong';
    return '';
  }

  /** Returns human-readable label for password strength */
  get strengthLabel(): string {
    const labels = ['', 'Weak', 'Fair', 'Strong'];
    return labels[this.passwordStrength];
  }

  /** Convenience getter: today's date in YYYY-MM-DD for max birthdate */
  get maxBirthDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  // ----------------------------------------------------------------
  // Field helpers for template-side error display
  // ----------------------------------------------------------------

  /** Returns true if the field is invalid and has been touched */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field?.invalid && (field.touched || field.dirty));
  }

  /** Returns true if the field is valid */
  isFieldValid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field?.valid && (field.touched || field.dirty));
  }

  /** Returns the first validation error message for a field */
  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (!field?.errors) return '';
    if (field.errors['required'])         return `This field is required.`;
    if (field.errors['email'])            return 'Please enter a valid email address.';
    if (field.errors['minlength']) {
      const min = field.errors['minlength'].requiredLength;
      return `Minimum ${min} characters required.`;
    }
    if (field.errors['maxlength']) {
      const max = field.errors['maxlength'].requiredLength;
      return `Maximum ${max} characters allowed.`;
    }
    if (field.errors['pattern'])          return 'Must be a valid Indian mobile number (e.g. 9********* or 8********** or 7**********).';
    if (field.errors['passwordStrength']) return 'Password must contain both uppercase and lowercase letters.';
    return 'Invalid value.';
  }

  /** True when the group-level passwordsMismatch error is active */
  get passwordsMismatch(): boolean {
    const cf = this.registerForm.get('confirmPassword');
    return !!(
      this.registerForm.errors?.['passwordsMismatch'] &&
      (cf?.touched || cf?.dirty)
    );
  }

  // ----------------------------------------------------------------
  // Form submission
  // ----------------------------------------------------------------

  /** Handles the form submit button click */
  onSubmit(): void {
    // Mark all fields as touched to trigger validation display
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.apiError   = null;
    this.apiSuccess = null;

    const payload = this.registerForm.value;

    this.authService.register(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          this.apiSuccess = res.message || 'Registered successfully';
          this.apiError = null;
          this.registerForm.reset();
          this.passwordStrength = 0;
        } else {
          this.apiError = res.message || 'Registration failed. Please try again.';
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        let msg = err?.error?.message;
        if (!msg && err?.error?.errors) {
          if (Array.isArray(err.error.errors)) {
            msg = err.error.errors[0]?.msg || err.error.errors[0];
          } else if (typeof err.error.errors === 'object') {
            const firstKey = Object.keys(err.error.errors)[0];
            const errVal = err.error.errors[firstKey];
            msg = Array.isArray(errVal) ? errVal[0] : errVal;
          }
        }
        this.apiError = msg || 'Registration failed. Please check your inputs and try again.';
      }
    });
  }
}
