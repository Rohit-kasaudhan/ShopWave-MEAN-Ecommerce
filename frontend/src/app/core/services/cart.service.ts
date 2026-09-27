/**
 * cart.service.ts — Cart API Service
 *
 * Manages cart state globally via BehaviorSubject.
 * The cartCount$ stream is used in the navbar badge.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from './auth.service';

export interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    images: { url: string; public_id: string }[];
    price: number;
    stock: number;
  };
  quantity: number;
  price: number;
  color?: string;
  size?: string;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalPrice: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly API = `${environment.apiUrl}/cart`;

  private _cart$ = new BehaviorSubject<Cart | null>(null);
  readonly cart$ = this._cart$.asObservable();

  /** Count badge for navbar */
  private _cartCount$ = new BehaviorSubject<number>(0);
  readonly cartCount$ = this._cartCount$.asObservable();

  constructor(private http: HttpClient) {}

  private _updateCount(cart: Cart | null): void {
    const count = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
    this._cartCount$.next(count);
  }

  loadCart(): Observable<ApiResponse<Cart>> {
    return this.http.get<ApiResponse<Cart>>(this.API).pipe(
      tap((res) => {
        const cart = res.data ?? null;
        this._cart$.next(cart);
        this._updateCount(cart);
      }),
    );
  }

  addItem(
    productId: string,
    quantity = 1,
    color?: string,
    size?: string,
  ): Observable<ApiResponse<Cart>> {
    return this.http
      .post<ApiResponse<Cart>>(`${this.API}/items`, { productId, quantity, color, size })
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            this._cart$.next(res.data);
            this._updateCount(res.data);
          }
        }),
      );
  }

  updateItem(itemId: string, quantity: number): Observable<ApiResponse<Cart>> {
    return this.http.patch<ApiResponse<Cart>>(`${this.API}/items/${itemId}`, { quantity }).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this._cart$.next(res.data);
          this._updateCount(res.data);
        }
      }),
    );
  }

  removeItem(itemId: string): Observable<ApiResponse<Cart>> {
    return this.http.delete<ApiResponse<Cart>>(`${this.API}/items/${itemId}`).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this._cart$.next(res.data);
          this._updateCount(res.data);
        }
      }),
    );
  }

  clearCart(): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.API).pipe(
      tap(() => {
        this._cart$.next(null);
        this._cartCount$.next(0);
      }),
    );
  }

  checkout(shippingAddress: any, paymentMethod = 'cash'): Observable<ApiResponse<any>> {
    return this.http
      .post<ApiResponse<any>>(`${this.API}/checkout`, { shippingAddress, paymentMethod })
      .pipe(
        tap((res) => {
          if (res.success) {
            this._cart$.next(null);
            this._cartCount$.next(0);
          }
        }),
      );
  }

  getSnapshot(): Cart | null {
    return this._cart$.value;
  }
}
