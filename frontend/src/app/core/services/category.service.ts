/**
 * category.service.ts — Category API Service
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from './auth.service';

export interface Category {
  _id: string;
  uuid: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly API = `${environment.apiUrl}/categories`;

  private _categories$ = new BehaviorSubject<Category[]>([]);
  readonly categories$ = this._categories$.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(this.API).pipe(
      tap((res) => {
        if (res.success && res.data) this._categories$.next(res.data);
      }),
    );
  }

  getOne(id: string): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<Category>>(`${this.API}/${id}`);
  }

  create(body: { name: string }): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(this.API, body).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this._categories$.next([...this._categories$.value, res.data]);
        }
      }),
    );
  }

  update(id: string, body: { name: string }): Observable<ApiResponse<Category>> {
    return this.http.put<ApiResponse<Category>>(`${this.API}/${id}`, body).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this._categories$.next(
            this._categories$.value.map((c) => (c._id === id ? res.data! : c)),
          );
        }
      }),
    );
  }

  delete(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.API}/${id}`).pipe(
      tap((res) => {
        if (res.success) {
          this._categories$.next(this._categories$.value.filter((c) => c._id !== id));
        }
      }),
    );
  }

  getSnapshot(): Category[] {
    return this._categories$.value;
  }
}
