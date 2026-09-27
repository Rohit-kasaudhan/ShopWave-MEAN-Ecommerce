import { Component } from '@angular/core';
import { ToastService, ToastMessage } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: false,
  template: `
    <div class="toast-container" *ngIf="toastService.toast$ | async as toast" [ngClass]="toast.type">
      <span class="material-icons">
        {{ toast.type === 'success' ? 'check_circle' : (toast.type === 'error' ? 'error' : 'info') }}
      </span>
      <span>{{ toast.message }}</span>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: var(--space-6);
      right: var(--space-6);
      z-index: var(--z-toast);
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-5);
      border-radius: var(--radius-md);
      color: #fff;
      font-weight: 600;
      font-size: var(--text-sm);
      box-shadow: var(--shadow-md);
      animation: slideInRight 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .success { background: var(--color-success); border: 1px solid #00b377; }
    .error { background: var(--color-error); border: 1px solid #e63950; }
    .info { background: var(--color-navy); border: 1px solid var(--color-navy-light); }
    .material-icons { font-size: 1.2rem; }

    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
