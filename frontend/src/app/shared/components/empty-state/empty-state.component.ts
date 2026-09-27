import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent {
  title = input.required<string>();
  description = input<string>('');
  icon = input<'cart' | 'search' | 'wishlist' | 'default'>('default');
  actionLabel = input<string>('');
}
