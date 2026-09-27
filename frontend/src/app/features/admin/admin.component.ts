import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  activeTab = 'dashboard';
  currentUser: User | null = null;
  sidebarOpen = false;

  navItems = [
    { id: 'dashboard', label: 'Overview', icon: 'dashboard' },
    { id: 'products', label: 'Products', icon: 'inventory_2' },
    { id: 'categories', label: 'Categories', icon: 'category' },
    { id: 'users', label: 'Users', icon: 'people' },
    { id: 'orders', label: 'Orders', icon: 'receipt_long' },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.authService.currentUser$.subscribe((u) => (this.currentUser = u));
  }

  setTab(tab: string): void {
    this.activeTab = tab;
    this.sidebarOpen = false;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  goToStore(): void {
    this.router.navigate(['/']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
