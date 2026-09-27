import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { finalize } from 'rxjs';

import {
  OrderService,
  Order
} from '../../../core/services/order.service';

import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-orders',
  standalone: false,
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent implements OnInit {

  orders: Order[] = [];
  filteredOrders: Order[] = [];

  isLoading = true;

  searchQuery = '';
  selectedStatusFilter = 'all';

  selectedOrder: Order | null = null;

  statuses = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled'
  ];

  constructor(
    private orderService: OrderService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  // =========================================================
  // LOAD ALL ORDERS
  // =========================================================

  loadOrders(): void {
    this.isLoading = true;

    console.log('ADMIN ORDERS: Loading orders...');

    this.orderService
      .getAllOrders()
      .pipe(
        finalize(() => {
          console.log(
            'ADMIN ORDERS: Request finished'
          );

          this.isLoading = false;

          // Make sure Angular updates the screen
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (res) => {

          console.log(
            'ADMIN ORDERS: API RESPONSE:',
            res
          );

          /*
           * Expected backend response:
           *
           * {
           *   success: true,
           *   data: [...]
           * }
           */

          if (
            res &&
            Array.isArray(res.data)
          ) {

            this.orders = res.data;

          } else {

            this.orders = [];

            console.warn(
              'ADMIN ORDERS: Unexpected response format:',
              res
            );
          }

          console.log(
            'ADMIN ORDERS: Orders received:',
            this.orders.length
          );

          this.applyFilter();
        },

        error: (err) => {

          console.error(
            'ADMIN ORDERS: Failed to load orders:',
            err
          );

          this.orders = [];
          this.filteredOrders = [];

          this.toast.show(
            err?.error?.message ||
              'Failed to load orders',
            'error'
          );
        }
      });
  }

  // =========================================================
  // FILTER ORDERS
  // =========================================================

  applyFilter(): void {

    let result = [...this.orders];

    // -------------------------------------------------------
    // STATUS FILTER
    // -------------------------------------------------------

    if (
      this.selectedStatusFilter !== 'all'
    ) {

      result = result.filter(
        (order) =>
          order.status ===
          this.selectedStatusFilter
      );
    }

    // -------------------------------------------------------
    // SEARCH FILTER
    // -------------------------------------------------------

    if (
      this.searchQuery &&
      this.searchQuery.trim()
    ) {

      const query =
        this.searchQuery
          .toLowerCase()
          .trim();

      result = result.filter(
        (order) => {

          const uuid =
            order.uuid?.toLowerCase() ||
            '';

          const firstName =
            order.user?.FirstName
              ?.toLowerCase() ||
            '';

          const lastName =
            order.user?.LastName
              ?.toLowerCase() ||
            '';

          const email =
            order.user?.email
              ?.toLowerCase() ||
            '';

          const phone =
            order.shippingAddress?.phone
              ?.toLowerCase() ||
            '';

          const city =
            order.shippingAddress?.city
              ?.toLowerCase() ||
            '';

          return (
            uuid.includes(query) ||
            firstName.includes(query) ||
            lastName.includes(query) ||
            email.includes(query) ||
            phone.includes(query) ||
            city.includes(query)
          );
        }
      );
    }

    this.filteredOrders = result;

    console.log(
      'ADMIN ORDERS: Filtered orders:',
      this.filteredOrders.length
    );
  }

  // =========================================================
  // UPDATE ORDER STATUS
  // =========================================================

  updateStatus(
    order: Order,
    newStatus: string
  ): void {

    if (
      !newStatus ||
      newStatus === order.status
    ) {
      return;
    }

    const oldStatus = order.status;

    console.log(
      `Updating order ${order.uuid}: ${oldStatus} → ${newStatus}`
    );

    this.orderService
      .updateStatus(
        order.uuid,
        newStatus
      )
      .subscribe({

        next: (res) => {

          console.log(
            'ADMIN ORDERS: Status update response:',
            res
          );

          if (res?.data) {

            order.status =
              res.data.status;

            order.deliveredAt =
              res.data.deliveredAt;

            if (
              this.selectedOrder &&
              this.selectedOrder.uuid ===
                order.uuid
            ) {

              this.selectedOrder.status =
                res.data.status;

              this.selectedOrder.deliveredAt =
                res.data.deliveredAt;
            }

          } else {

            order.status =
              newStatus as Order['status'];
          }

          this.toast.show(
            `Order #${order.uuid.slice(
              0,
              8
            )} status updated to ${newStatus}`,
            'success'
          );

          this.applyFilter();

          this.cdr.detectChanges();
        },

        error: (err) => {

          console.error(
            'ADMIN ORDERS: Status update failed:',
            err
          );

          // Restore previous status
          order.status = oldStatus;

          this.toast.show(
            err?.error?.message ||
              'Failed to update order status',
            'error'
          );

          this.cdr.detectChanges();
        }
      });
  }

  // =========================================================
  // ORDER DETAILS
  // =========================================================

  openOrderDetail(
    order: Order
  ): void {

    this.selectedOrder = order;
  }

  closeOrderDetail(): void {

    this.selectedOrder = null;
  }

  // =========================================================
  // STATUS COLOR
  // =========================================================

  getStatusColor(
    status: string
  ): string {

    const map: Record<string, string> = {

      pending:
        'var(--color-warning)',

      processing:
        '#3b82f6',

      shipped:
        '#8b5cf6',

      delivered:
        'var(--color-success)',

      cancelled:
        'var(--color-error)'
    };

    return (
      map[status] ||
      '#9ca3af'
    );
  }

  // =========================================================
  // PRODUCT IMAGE
  // =========================================================

  getItemImage(
    item: any
  ): string {

    if (
      item?.product?.images?.[0]?.url
    ) {

      return item.product.images[0].url;
    }

    if (
      typeof item?.product === 'object' &&
      item.product?.images?.[0]
    ) {

      return item.product.images[0];
    }

    if (item?.image) {

      return item.image;
    }

    return 'assets/placeholder.png';
  }

  // =========================================================
  // PRODUCT NAME
  // =========================================================

  getItemName(
    item: any
  ): string {

    if (item?.name) {

      return item.name;
    }

    if (
      item?.product?.name
    ) {

      return item.product.name;
    }

    return 'Product';
  }
}