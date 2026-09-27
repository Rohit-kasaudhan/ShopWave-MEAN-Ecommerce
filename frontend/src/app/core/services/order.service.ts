import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResponse } from './auth.service';

export interface OrderItem {
  product: any;
  name?: string;
  price: number;
  quantity: number;
  qty?: number;
  image?: string;
  color?: string;
  size?: string;
}

export interface Order {
  _id: string;
  uuid: string;
  user: any;
  items: OrderItem[];
  totalPrice: number;
  status:
    | 'pending'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled';

  shippingAddress?: {
    street?: string;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    phone?: string;
  };

  paymentMethod: 'cash' | 'card';
  createdAt: string;
  deliveredAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly API = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  getMyOrders(): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(`${this.API}/my`);
  }

  getOrder(id: string): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(`${this.API}/${id}`);
  }

  getAllOrders(): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(`${this.API}/admin/all`);
  }

  updateStatus(
    id: string,
    status: string
  ): Observable<ApiResponse<Order>> {
    return this.http.patch<ApiResponse<Order>>(
      `${this.API}/${id}/status`,
      { status }
    );
  }
}