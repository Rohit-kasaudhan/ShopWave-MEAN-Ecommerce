import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService, Product } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-wishlist-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist-button.component.html',
  styleUrls: ['./wishlist-button.component.scss']
})
export class WishlistButtonComponent {
  product = input.required<Product>();

  constructor(private wishlistService: WishlistService) {}

  get isFavorite(): boolean {
    return this.wishlistService.isInWishlist(this.product().id);
  }

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    this.wishlistService.toggleItem(this.product());
  }
}
