import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toast$ = new BehaviorSubject<ToastMessage | null>(null);
  readonly toast$: Observable<ToastMessage | null> = this._toast$.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000): void {
    this._toast$.next({ message, type });
    setTimeout(() => this.hide(), duration);
  }

  hide(): void {
    this._toast$.next(null);
  }
}
