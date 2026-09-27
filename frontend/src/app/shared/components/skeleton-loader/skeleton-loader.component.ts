import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss']
})
export class SkeletonLoaderComponent {
  type = input<'card' | 'list' | 'text'>('card');
  count = input<number>(1);
  
  get items(): number[] {
    return Array.from({ length: this.count() }, (_, i) => i);
  }
}
