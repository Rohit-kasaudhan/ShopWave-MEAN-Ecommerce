/**
 * user.service.ts — User Management Service (Admin)
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, User } from './auth.service';

export interface CreateUserPayload {
  FirstName: string;
  LastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
  gender: 'male' | 'female';
  role?: 'user' | 'admin';
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly API = `${environment.apiUrl}/users`;

  private _users$ = new BehaviorSubject<User[]>([]);
  readonly users$ = this._users$.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(this.API).pipe(
      tap((res) => {
        if (res.success && res.data) this._users$.next(res.data);
      }),
    );
  }

  getOne(uuid: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.API}/${uuid}`);
  }

  create(payload: CreateUserPayload): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(this.API, payload).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this._users$.next([...this._users$.value, res.data]);
        }
      }),
    );
  }

  update(uuid: string, body: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.API}/${uuid}`, body).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this._users$.next(this._users$.value.map((u) => (u.uuid === uuid ? res.data! : u)));
        }
      }),
    );
  }

  delete(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.API}/${uuid}`).pipe(
      tap((res) => {
        if (res.success) {
          this._users$.next(this._users$.value.filter((u) => u.uuid !== uuid));
        }
      }),
    );
  }
}
