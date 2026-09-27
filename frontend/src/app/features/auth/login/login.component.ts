/**
 * login.component.ts — User Login Component
 *
 * Collects: email, password.
 * Calls POST /api/v1/auth/login.
 * On success: saves JWT token to localStorage and navigates to /dashboard.
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,  // Declared in AppModule
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  /** Reactive form group for login fields */
  loginForm!: FormGroup;

  /** True while the HTTP request is pending */
  isLoading = false;

  /** API error message to display in the alert banner */
  apiError: string | null = null;

  /** Whether the password is shown as plain text */
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      const user = this.authService.getCurrentUser();
      if (user?.role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/home']);
      }
      return;
    }
    this.buildForm();
  }

  /** Initialises the login FormGroup with validators */
  private buildForm(): void {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /** Auto-fills the fixed admin credentials for quick login */
  fillAdminCredentials(): void {
    this.loginForm.patchValue({
      email: 'admin@shopwave.com',
      password: 'admin123456'
    });
    this.apiError = null;
  }

  // ----------------------------------------------------------------
  // Field helpers
  // ----------------------------------------------------------------

  /** Returns true if the field is invalid and touched */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.invalid && (field.touched || field.dirty));
  }

  /** Returns true if the field is valid and touched */
  isFieldValid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.valid && (field.touched || field.dirty));
  }

  /** Returns the first validation error message for a field */
  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field?.errors) return '';
    if (field.errors['required'])   return 'This field is required.';
    if (field.errors['email'])      return 'Please enter a valid email address.';
    if (field.errors['minlength'])  return `Minimum ${field.errors['minlength'].requiredLength} characters required.`;
    return 'Invalid value.';
  }

  // ----------------------------------------------------------------
  // Form submission
  // ----------------------------------------------------------------

  /** Handles the login form submission */
  onSubmit(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.apiError  = null;

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success && res.token) {
          // Persist the JWT and navigate to appropriate page
          this.authService.saveToken(res.token);
          const user = res.data || this.authService.getCurrentUser();
          if (user?.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/home']);
          }
        } else {
          this.apiError = res.message || 'Login failed. Please check your credentials.';
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
        this.apiError = msg || 'Login failed. Please check your credentials and try again.';
      }
    });
  }
}
