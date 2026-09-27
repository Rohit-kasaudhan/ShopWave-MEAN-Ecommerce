import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  isLoading = true;
  isAddingToCart = false;
  selectedImage = 0;
  selectedColor = '';
  selectedSize = '';
  quantity = 1;

  activeTab: 'desc' | 'specs' | 'shipping' = 'desc';
  showZoomModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cart: CartService,
    private toast: ToastService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) {
        this.router.navigate(['/products']);
        return;
      }

      this.isLoading = true;
      this.selectedImage = 0;
      this.quantity = 1;

      // Check cache first for instant render
      const cached = this.productService
        .getSnapshot()
        .find((p) => p.uuid === id || p._id === id);
      if (cached) {
        this.product = cached;
        if (this.product?.colors?.length) this.selectedColor = this.product.colors[0];
        if (this.product?.sizes?.length) this.selectedSize = this.product.sizes[0];
        this.loadRelatedProducts();
        this.isLoading = false;
      }

      // Fetch fresh details from API
      this.productService.getOne(id).subscribe({
        next: (res) => {
          this.product = res.data ?? this.product;
          if (this.product?.colors?.length && !this.selectedColor) {
            this.selectedColor = this.product.colors[0];
          }
          if (this.product?.sizes?.length && !this.selectedSize) {
            this.selectedSize = this.product.sizes[0];
          }
          this.loadRelatedProducts();
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          if (!this.product) {
            this.router.navigate(['/products']);
          }
        },
      });
    });
  }

  loadRelatedProducts(): void {
    if (!this.product) return;
    const catId = typeof this.product.category === 'object' ? this.product.category._id : this.product.category;
    const all = this.productService.getSnapshot();
    this.relatedProducts = all
      .filter((p) => (p._id !== this.product?._id && p.uuid !== this.product?.uuid))
      .slice(0, 4);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%231a1a2e"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%236495ed" font-family="sans-serif" font-size="20">ShopWave</text></svg>';
  }

  get mainImage(): string {
    return this.product?.images?.[this.selectedImage]?.url ?? 'assets/placeholder.png';
  }

  get categoryName(): string {
    const cat = this.product?.category;
    return cat && typeof cat === 'object' ? cat.name : 'Catalog';
  }

  get isInStock(): boolean {
    return (this.product?.stock ?? 0) > 0;
  }

  incrementQty(): void {
    if (this.quantity < (this.product?.stock ?? 1)) this.quantity++;
  }

  decrementQty(): void {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart(): void {
    if (!this.auth.isLoggedIn()) { this.router.navigate(['/login']); return; }
    if (!this.product || !this.isInStock) return;

    this.isAddingToCart = true;
    this.cart.addItem(this.product._id, this.quantity, this.selectedColor, this.selectedSize).subscribe({
      next: () => {
        this.toast.show(`🛒 Added ${this.quantity} item(s) to your cart!`, 'success');
        this.isAddingToCart = false;
      },
      error: () => {
        this.toast.show('Failed to add item to cart', 'error');
        this.isAddingToCart = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  openZoomModal(): void {
    this.showZoomModal = true;
  }

  closeZoomModal(): void {
    this.showZoomModal = false;
  }
}
