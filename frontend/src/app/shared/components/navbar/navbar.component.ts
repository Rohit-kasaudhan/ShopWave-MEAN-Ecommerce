import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService, User } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser$: Observable<User | null>;
  isLoggedIn$: Observable<any>;
  cartCount$: Observable<number>;

  isScrolled = false;
  isUserMenuOpen = false;
  isMobileMenuOpen = false;
  showAnnouncement = true;

  searchQuery = '';

  private sub!: Subscription;

  constructor(
    private auth: AuthService,
    private cart: CartService,
    private router: Router,
  ) {
    this.currentUser$ = this.auth.currentUser$;
    this.isLoggedIn$ = this.auth.currentUser$;
    this.cartCount$ = this.cart.cartCount$;
  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.sub = this.cart.loadCart().subscribe();
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 20;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      this.isUserMenuOpen = false;
    }
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  dismissAnnouncement(): void {
    this.showAnnouncement = false;
  }

  onSearchSubmit(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/products'], { queryParams: { search: this.searchQuery.trim() } });
      this.searchQuery = '';
      this.closeMobileMenu();
    }
  }

  logout(): void {
    this.auth.logout();
    this.closeUserMenu();
    this.closeMobileMenu();
    this.router.navigate(['/login']);
  }
}
