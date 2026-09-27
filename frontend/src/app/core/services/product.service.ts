/**
 * product.service.ts — Product API Service
 *
 * All CRUD operations for products. Uses BehaviorSubject to cache
 * the product list so multiple components share the same data.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from './auth.service';

export interface ProductImage {
  url: string;
  public_id: string;
}

export interface Product {
  _id: string;
  uuid: string;
  name: string;
  description: string;
  price: number;
  category: { _id: string; name: string; slug: string; uuid: string } | string;
  stock: number;
  images: ProductImage[];
  colors: string[];
  sizes: string[];
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly API = `${environment.apiUrl}/products`;

  private _products$ = new BehaviorSubject<Product[]>([]);
  readonly products$ = this._products$.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(this.API).pipe(
      tap((res) => {
        if (res.success && res.data) this._products$.next(res.data);
      }),
    );
  }

  getOne(uuid: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.API}/${uuid}`);
  }

  /** Admin: create product with FormData (images via Cloudinary) */
  create(formData: FormData): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(this.API, formData).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this._products$.next([res.data, ...this._products$.value]);
        }
      }),
    );
  }

  /** Admin: update product fields (no images) */
  update(uuid: string, body: Partial<Product>): Observable<ApiResponse<Product[]>> {
    return this.http.put<ApiResponse<Product[]>>(`${this.API}/${uuid}`, body).pipe(
      tap((res) => {
        if (res.success && res.data) this._products$.next(res.data);
      }),
    );
  }

  /** Admin: delete product */
  delete(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.API}/${uuid}`).pipe(
      tap((res) => {
        if (res.success) {
          this._products$.next(this._products$.value.filter((p) => p.uuid !== uuid));
        }
      }),
    );
  }

  /** Admin: add images to product */
  addImages(uuid: string, formData: FormData): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(`${this.API}/${uuid}/images`, formData);
  }

  /** Admin: delete a product image */
  deleteImage(uuid: string, publicId: string): Observable<ApiResponse<Product>> {
    return this.http.delete<ApiResponse<Product>>(`${this.API}/${uuid}/images`, {
      body: { public_id: publicId },
    });
  }

  /** Get current cached list */
  getSnapshot(): Product[] {
    return this._products$.value;
  }
}
