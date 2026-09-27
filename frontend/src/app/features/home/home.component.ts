import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService, Product } from '../../core/services/product.service';
import { CategoryService, Category } from '../../core/services/category.service';
import { ToastService } from '../../core/services/toast.service';

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  featuredProducts: Product[] = [];
  displayProducts: Product[] = [];
  categories: Category[] = [];
  isLoading = true;

  heroSearchQuery = '';
  activeProductTab: 'all' | 'featured' | 'sale' = 'all';

  // Flash sale countdown timer
  timerHours = '08';
  timerMinutes = '45';
  timerSeconds = '30';
  private timerInterval: any;

  // Newsletter
  newsletterEmail = '';
  isSubscribing = false;

  stats = [
    { icon: 'inventory_2', value: '10K+', label: 'Premium Items' },
    { icon: 'people', value: '50K+', label: 'Happy Customers' },
    { icon: 'star', value: '4.9/5', label: 'Customer Rating' },
    { icon: 'local_shipping', value: 'Free', label: 'Worldwide Shipping' },
  ];

  valueProps = [
    {
      icon: 'rocket_launch',
      title: 'Express Delivery',
      desc: 'Lightning fast 24-48h dispatch right to your doorstep.',
    },
    {
      icon: 'verified_user',
      title: '100% Authentic',
      desc: 'Sourced directly from verified brands with official warranty.',
    },
    {
      icon: 'currency_exchange',
      title: 'Hassle-Free Returns',
      desc: '30-day instant exchange or full money-back guarantee.',
    },
    {
      icon: 'headset_mic',
      title: '24/7 VIP Support',
      desc: 'Dedicated concierge team available anytime to assist you.',
    },
  ];

  testimonials: Testimonial[] = [
    {
      name: 'Sarah Jenkins',
      role: 'Verified Buyer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      comment: 'The checkout was super fast and my package arrived in 2 days! Quality exceeds expectations.',
    },
    {
      name: 'Alex Rivera',
      role: 'Fashion Enthusiast',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      comment: 'ShopWave has become my go-to store. Product details are clear and customer support is top tier!',
    },
    {
      name: 'Elena Rostova',
      role: 'Repeat Customer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      comment: 'Unbeatable prices and sleek modern design. I love the real-time tracking updates.',
    },
  ];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.startCountdownTimer();

    this.productService.products$.subscribe((p) => {
      if (p && p.length > 0) {
        this.featuredProducts = p;
        this.filterTab(this.activeProductTab);
        this.isLoading = false;
      }
    });

    this.productService.getAll().subscribe({
      next: (res) => {
        if (res.data) {
          this.featuredProducts = res.data;
          this.filterTab(this.activeProductTab);
        }
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });

    this.categoryService.getAll().subscribe({
      next: (res) => {
        if (res.data) this.categories = res.data;
      },
    });
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  startCountdownTimer(): void {
    let secondsTotal = 8 * 3600 + 45 * 60 + 30;
    this.timerInterval = setInterval(() => {
      if (secondsTotal <= 0) {
        secondsTotal = 12 * 3600;
      } else {
        secondsTotal--;
      }
      const h = Math.floor(secondsTotal / 3600);
      const m = Math.floor((secondsTotal % 3600) / 60);
      const s = secondsTotal % 60;
      this.timerHours = h < 10 ? `0${h}` : `${h}`;
      this.timerMinutes = m < 10 ? `0${m}` : `${m}`;
      this.timerSeconds = s < 10 ? `0${s}` : `${s}`;
    }, 1000);
  }

  onHeroSearch(): void {
    if (this.heroSearchQuery.trim()) {
      this.router.navigate(['/products'], { queryParams: { search: this.heroSearchQuery.trim() } });
    } else {
      this.goToProducts();
    }
  }

  filterTab(tab: 'all' | 'featured' | 'sale'): void {
    this.activeProductTab = tab;
    if (tab === 'all') {
      this.displayProducts = this.featuredProducts.slice(0, 8);
    } else if (tab === 'featured') {
      this.displayProducts = this.featuredProducts.filter((p) => p.stock > 0).slice(0, 8);
    } else if (tab === 'sale') {
      this.displayProducts = [...this.featuredProducts]
        .sort((a, b) => a.price - b.price)
        .slice(0, 8);
    }
  }

  searchByCategory(categoryId: string): void {
    this.router.navigate(['/products'], { queryParams: { category: categoryId } });
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }

  getCategoryIcon(name: string): string {
    const n = name?.toLowerCase() || '';
    if (n.includes('electr') || n.includes('tech')) return 'devices';
    if (n.includes('cloth') || n.includes('fashion') || n.includes('apparel')) return 'checkroom';
    if (n.includes('shoe') || n.includes('footwear')) return 'ice_skating';
    if (n.includes('access') || n.includes('jewel') || n.includes('watch')) return 'watch';
    if (n.includes('home') || n.includes('decor')) return 'chair';
    if (n.includes('sport') || n.includes('fitness')) return 'fitness_center';
    if (n.includes('beauty') || n.includes('skin')) return 'face';
    return 'dashboard_customize';
  }

  subscribeNewsletter(): void {
    if (!this.newsletterEmail || !this.newsletterEmail.includes('@')) {
      this.toast.show('Please enter a valid email address', 'error');
      return;
    }
    this.isSubscribing = true;
    setTimeout(() => {
      this.toast.show('🎉 Welcome! Coupon code SAVE15 applied to your next order.', 'success');
      this.newsletterEmail = '';
      this.isSubscribing = false;
    }, 800);
  }
}
