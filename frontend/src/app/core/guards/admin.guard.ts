/**
 * admin.guard.ts — Route Guard for admin-only routes
 * Redirects non-admin users to /home
 */
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.auth.getCurrentUser();
    if (this.auth.isLoggedIn() && user?.role === 'admin') return true;
    this.router.navigate(['/home']);
    return false;
  }
}
