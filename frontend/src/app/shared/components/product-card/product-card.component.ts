import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addedToCart = new EventEmitter<Product>();

  constructor(
    private cart: CartService,
    private toast: ToastService,
    private auth: AuthService,
    private router: Router
  ) {}

  get mainImage(): string {
    return this.product.images?.[0]?.url || 'assets/placeholder.png';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;

    img.src =
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%231a1a2e"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%236495ed" font-family="sans-serif" font-size="20">ShopWave</text></svg>';
  }

  get categoryName(): string {
    const cat = this.product.category;
    return typeof cat === 'object' ? cat.name : '';
  }

  get isInStock(): boolean {
    return this.product.stock > 0;
  }

  goToDetail(): void {
    this.router.navigate(['/products', this.product.uuid]);
  }

  addToCart(event: Event): void {
    event.stopPropagation();

    // User must be logged in
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Don't allow adding an out-of-stock product
    if (!this.isInStock) {
      return;
    }

    // Add product to cart
    this.cart.addItem(this.product._id).subscribe({
      next: () => {
        this.toast.show('Added to cart!', 'success');
        this.addedToCart.emit(this.product);
      },

      error: () => {
        this.toast.show('Failed to add to cart', 'error');
      },
    });
  }
}