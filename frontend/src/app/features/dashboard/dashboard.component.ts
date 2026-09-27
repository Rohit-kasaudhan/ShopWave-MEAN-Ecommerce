/**
 * dashboard.component.ts — Post-login Dashboard Placeholder
 *
 * A simple landing page shown after successful login.
 * Displays the user's session and provides a logout button.
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Guard: redirect to login if not authenticated
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  /** Logs the user out and redirects to login */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
