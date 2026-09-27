import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Review {
  rating: number;
  comment: string;
  userName?: string;
  date?: Date;
}

@Component({
  selector: 'app-review-rating',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-rating.component.html',
  styleUrls: ['./review-rating.component.scss']
})
export class ReviewRatingComponent {
  reviews = input<Review[]>([]);
  averageRating = input<number>(0);
  readOnly = input<boolean>(false);
  
  reviewSubmitted = output<Review>();

  newReview = signal<Review>({ rating: 0, comment: '' });
  hoverRating = signal<number>(0);
  stars = [1, 2, 3, 4, 5];

  setRating(rating: number): void {
    if (this.readOnly()) return;
    this.newReview.update(review => ({ ...review, rating }));
  }

  setHover(rating: number): void {
    if (this.readOnly()) return;
    this.hoverRating.set(rating);
  }

  submitReview(): void {
    if (this.newReview().rating === 0) return;
    this.reviewSubmitted.emit(this.newReview());
    this.newReview.set({ rating: 0, comment: '' });
  }
}
