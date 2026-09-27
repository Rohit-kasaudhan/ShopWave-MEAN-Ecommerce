import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService, Product } from '../../../core/services/product.service';
import { CategoryService, Category } from '../../../core/services/category.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-products',
  standalone: false,
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css',
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  isLoading = true;
  showForm = false;
  isSubmitting = false;
  editingProduct: Product | null = null;
  previewProduct: Product | null = null;
  form!: FormGroup;
  selectedFiles: File[] = [];

  searchQuery = '';
  selectedCategoryFilter = 'all';
  selectedStockFilter = 'all';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.productService.products$.subscribe((p) => {
      this.products = p;
      this.applyFilter();
      if (p && p.length >= 0) this.isLoading = false;
    });
    this.productService.getAll().subscribe({
      next: (res) => {
        this.products = res.data ?? [];
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
    this.categoryService.getAll().subscribe((res) => {
      this.categories = res.data ?? [];
    });
  }

  applyFilter(): void {
    let result = [...this.products];

    // Category Filter
    if (this.selectedCategoryFilter !== 'all') {
      result = result.filter((p) => {
        const catId = typeof p.category === 'object' ? p.category._id : p.category;
        return catId === this.selectedCategoryFilter;
      });
    }

    // Stock Filter
    if (this.selectedStockFilter === 'low') {
      result = result.filter((p) => p.stock > 0 && p.stock < 5);
    } else if (this.selectedStockFilter === 'out') {
      result = result.filter((p) => p.stock === 0);
    } else if (this.selectedStockFilter === 'in') {
      result = result.filter((p) => p.stock >= 5);
    }

    // Search Query
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          this.getCategoryName(p.category)?.toLowerCase().includes(q)
      );
    }

    this.filteredProducts = result;
  }

  initForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      colors: [''],
      sizes: [''],
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files).slice(0, 4);
    }
  }

  openCreate(): void {
    this.editingProduct = null;
    this.form.reset({ price: 0, stock: 0 });
    this.selectedFiles = [];
    this.showForm = true;
  }

  openEdit(product: Product): void {
    this.editingProduct = product;
    const cat = typeof product.category === 'object' ? product.category._id : product.category;
    this.form.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: cat,
      colors: product.colors?.join(', ') ?? '',
      sizes: product.sizes?.join(', ') ?? '',
    });
    this.selectedFiles = [];
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingProduct = null;
  }

  openImagePreview(product: Product): void {
    this.previewProduct = product;
  }

  closeImagePreview(): void {
    this.previewProduct = null;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;

    if (this.editingProduct) {
      this.productService.update(this.editingProduct.uuid, this.form.value).subscribe({
        next: () => {
          this.toast.show('Product updated!', 'success');
          this.closeForm();
          this.isSubmitting = false;
        },
        error: (err) => {
          this.toast.show(err.error?.message ?? 'Update failed', 'error');
          this.isSubmitting = false;
        },
      });
    } else {
      const fd = new FormData();
      Object.entries(this.form.value).forEach(([k, v]) => fd.append(k, String(v)));
      this.selectedFiles.forEach((f) => fd.append('images', f));
      this.productService.create(fd).subscribe({
        next: () => {
          this.toast.show('Product created!', 'success');
          this.closeForm();
          this.isSubmitting = false;
        },
        error: (err) => {
          this.toast.show(err.error?.message ?? 'Create failed', 'error');
          this.isSubmitting = false;
        },
      });
    }
  }

  delete(uuid: string): void {
    if (!confirm('Delete this product?')) return;
    this.productService.delete(uuid).subscribe({
      next: () => this.toast.show('Product deleted', 'success'),
      error: () => this.toast.show('Delete failed', 'error'),
    });
  }

  getCategoryName(cat: any): string {
    return typeof cat === 'object' ? cat.name : (this.categories.find((c) => c._id === cat)?.name ?? 'Uncategorized');
  }

  getMainImage(p: Product): string {
    return p.images?.[0]?.url ?? 'assets/placeholder.png';
  }
}
