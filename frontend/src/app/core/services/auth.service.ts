/**
 * auth.service.ts — Full Authentication Service (Updated)
 *
 * Handles auth endpoints + session management via BehaviorSubject.
 * The currentUser$ stream lets any component react to auth state changes.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RegisterPayload {
  FirstName: string;
  LastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
  gender: 'male' | 'female';
}

export interface VerifyEmailPayload {
  email: string;
  verificationCode: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  uuid: string;
  FirstName: string;
  LastName: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  gender: 'male' | 'female';
  birthDate: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  token?: string;
  data?: T;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'shopwave_token';
  private readonly USER_KEY = 'shopwave_user';
  private readonly PENDING_EMAIL_KEY = 'shopwave_pending_email';

  /** Reactive stream: emits the current user or null when logged out */
  private _currentUser$ = new BehaviorSubject<User | null>(this._loadUser());
  readonly currentUser$ = this._currentUser$.asObservable();

  constructor(private http: HttpClient) {}

  // ─── API Calls ───────────────────────────────────────────────────────────────

  register(payload: RegisterPayload): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API}/register`, payload);
  }

  verifyEmail(payload: VerifyEmailPayload): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.API}/verifyEmail`, payload).pipe(
      tap((res) => {
        if (res.success && res.token) {
          this.saveToken(res.token);
          if (res.data) this.saveUser(res.data);
        }
      }),
    );
  }

  login(payload: LoginPayload): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.API}/login`, payload).pipe(
      tap((res) => {
        if (res.success && res.token) {
          this.saveToken(res.token);
          if (res.data) this.saveUser(res.data);
        }
      }),
    );
  }

  // ─── Session Helpers ──────────────────────────────────────────────────────────

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this._currentUser$.value;
  }

  saveUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this._currentUser$.next(user);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.PENDING_EMAIL_KEY);
    this._currentUser$.next(null);
  }

  // ─── Pending Email ────────────────────────────────────────────────────────────

  setPendingEmail(email: string): void {
    localStorage.setItem(this.PENDING_EMAIL_KEY, email);
  }

  getPendingEmail(): string | null {
    return localStorage.getItem(this.PENDING_EMAIL_KEY);
  }

  clearPendingEmail(): void {
    localStorage.removeItem(this.PENDING_EMAIL_KEY);
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────────

  private _loadUser(): User | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
