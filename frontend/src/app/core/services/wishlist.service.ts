import { Injectable, signal } from '@angular/core';

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems = signal<Product[]>(this.loadWishlist());
  
  public items = this.wishlistItems.asReadonly();

  constructor() {}

  private loadWishlist(): Product[] {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  }

  private saveWishlist(items: Product[]): void {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }

  toggleItem(product: Product): void {
    const currentItems = this.wishlistItems();
    const index = currentItems.findIndex(item => item.id === product.id);

    let newItems;
    if (index > -1) {
      newItems = currentItems.filter(item => item.id !== product.id);
    } else {
      newItems = [...currentItems, product];
    }

    this.wishlistItems.set(newItems);
    this.saveWishlist(newItems);
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistItems().some(item => item.id === productId);
  }
}
