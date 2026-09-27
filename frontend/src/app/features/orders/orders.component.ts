import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

import { OrderService, Order } from '../../core/services/order.service';

@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;
  expandedOrder: string | null = null;

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.isLoading = true;

    this.orderService.getMyOrders().subscribe({
      next: (res) => {
        console.log('MY ORDERS RESPONSE:', res);

        if (res && res.success && Array.isArray(res.data)) {
          this.orders = res.data;
        } else {
          this.orders = [];
          console.warn('Unexpected orders response:', res);
        }

        // Automatically expand the newest order
        if (this.orders.length > 0) {
          this.expandedOrder = this.getOrderIdentifier(
            this.orders[0]
          );
        } else {
          this.expandedOrder = null;
        }

        this.isLoading = false;

        // Make sure Angular updates the UI
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Error fetching orders:', err);

        this.orders = [];
        this.expandedOrder = null;
        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  toggleExpand(id: string): void {
    this.expandedOrder =
      this.expandedOrder === id ? null : id;
  }

  getOrderIdentifier(order: Order): string {
    return order.uuid || order._id || '';
  }

  getItemName(item: OrderItemLike): string {
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

  getItemImage(item: OrderItemLike): string {
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

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;

    img.src =
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%231a1a2e"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%236495ed" font-family="sans-serif" font-size="20">ShopWave</text></svg>';
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'status-pending',
      processing: 'status-processing',
      shipped: 'status-shipped',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled',
    };

    return map[status] ?? '';
  }

  getStatusIcon(status: string): string {
    const map: Record<string, string> = {
      pending: 'hourglass_empty',
      processing: 'autorenew',
      shipped: 'local_shipping',
      delivered: 'check_circle',
      cancelled: 'cancel',
    };

    return map[status] ?? 'info';
  }
}

interface OrderItemLike {
  name?: string;
  image?: string;
  quantity?: number;
  qty?: number;
  product?: any;
}