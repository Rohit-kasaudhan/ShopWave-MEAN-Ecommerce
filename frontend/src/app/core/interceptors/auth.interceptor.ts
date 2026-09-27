/**
 * auth.interceptor.ts — JWT Auth Interceptor
 *
 * Automatically attaches the JWT bearer token (from localStorage)
 * to every outgoing HTTP request. If the token is present, it adds:
 *   Authorization: Bearer <token>
 *
 * This means all service files never need to manually set the header.
 */
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly TOKEN_KEY = 'shopwave_token';

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem(this.TOKEN_KEY);

    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
