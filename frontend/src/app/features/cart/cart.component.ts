import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { CartService, Cart } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  isLoading = true;
  isCheckingOut = false;

  shippingAddress = {
    street: '',
    city: '',
    country: '',
    postalCode: '',
  };

  paymentMethod = 'cash';
  showCheckoutForm = false;

  placedOrder: any = null;
  showOrderSuccessModal = false;

  constructor(
    private cartService: CartService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe((cart) => {
      this.cart = cart;

      if (cart !== null) {
        this.isLoading = false;
      }
    });

    this.cartService.loadCart().subscribe({
      next: (res) => {
        this.cart = res.data ?? null;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load cart:', err);
        this.isLoading = false;
      },
    });
  }

  updateQuantity(itemId: string, qty: number): void {
    if (qty < 1) {
      return;
    }

    this.cartService.updateItem(itemId, qty).subscribe({
      error: (err) => {
        console.error('Failed to update quantity:', err);
        this.toast.show('Failed to update quantity', 'error');
      },
    });
  }

  removeItem(itemId: string): void {
    this.cartService.removeItem(itemId).subscribe({
      next: () => {
        this.toast.show('Item removed', 'success');
      },
      error: (err) => {
        console.error('Failed to remove item:', err);
        this.toast.show('Failed to remove item', 'error');
      },
    });
  }

  checkout(): void {
    // Prevent duplicate checkout requests
    if (this.isCheckingOut) {
      return;
    }

    // Validate shipping information
    if (
      !this.shippingAddress.street.trim() ||
      !this.shippingAddress.city.trim() ||
      !this.shippingAddress.country.trim() ||
      !this.shippingAddress.postalCode.trim()
    ) {
      this.toast.show('Please fill in all shipping details', 'error');
      return;
    }

    // Validate cart
    if (!this.cart || this.cart.items.length === 0) {
      this.toast.show('Your cart is empty', 'error');
      return;
    }

    this.isCheckingOut = true;

    this.cartService
      .checkout(this.shippingAddress, this.paymentMethod)
      .pipe(
        finalize(() => {
          // Always restore the button
          this.isCheckingOut = false;
        })
      )
      .subscribe({
        next: (res: any) => {
          console.log('CHECKOUT SUCCESS:', res);

          if (!res?.success || !res?.data) {
            this.toast.show('Order response was invalid', 'error');
            return;
          }

          // Save the complete order returned by backend
          this.placedOrder = res.data;

          // Hide checkout form
          this.showCheckoutForm = false;

          // Show success modal
          this.showOrderSuccessModal = true;

          this.toast.show(
            'Order placed successfully! 🎉',
            'success'
          );
        },

        error: (err) => {
          console.error('CHECKOUT ERROR:', err);

          const message =
            err?.error?.message ||
            'Failed to place order';

          this.toast.show(message, 'error');
        },
      });
  }

  closeOrderSuccessModal(): void {
    this.showOrderSuccessModal = false;
    this.router.navigate(['/orders']);
  }

  viewAllOrders(): void {
    this.showOrderSuccessModal = false;
    this.router.navigate(['/orders']);
  }

  continueShopping(): void {
    this.showOrderSuccessModal = false;
    this.router.navigate(['/products']);
  }

  getOrderItemName(item: any): string {
    if (item?.name) {
      return item.name;
    }

    if (
      typeof item?.product === 'object' &&
      item.product?.name
    ) {
      return item.product.name;
    }

    return 'Product';
  }

  getOrderItemImage(item: any): string {
    if (item?.image) {
      return item.image;
    }

    if (
      typeof item?.product === 'object' &&
      item.product?.images?.[0]?.url
    ) {
      return item.product.images[0].url;
    }

    if (
      typeof item?.product === 'object' &&
      typeof item.product?.images?.[0] === 'string'
    ) {
      return item.product.images[0];
    }

    return 'assets/placeholder.png';
  }

  getOrderIdentifier(order: any): string {
    return order?.uuid || order?._id || '';
  }

  get totalItems(): number {
    return (
      this.cart?.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      ) ?? 0
    );
  }

  getItemName(item: any): string {
    if (
      typeof item?.product === 'object' &&
      item.product?.name
    ) {
      return item.product.name;
    }

    return 'Item';
  }

  getItemImage(item: any): string {
    if (
      typeof item?.product === 'object' &&
      item.product?.images?.[0]?.url
    ) {
      return item.product.images[0].url;
    }

    return 'assets/placeholder.png';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;

    img.src =
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%231a1a2e"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%236495ed" font-family="sans-serif" font-size="20">ShopWave</text></svg>';
  }
}