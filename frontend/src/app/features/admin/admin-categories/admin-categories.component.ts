import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService, Category } from '../../../core/services/category.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-categories',
  standalone: false,
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.css'
})
export class AdminCategoriesComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  isLoading = true;
  showForm = false;
  isSubmitting = false;
  editingCategory: Category | null = null;
  form!: FormGroup;
  searchQuery = '';

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({ name: ['', [Validators.required, Validators.maxLength(50)]] });
    this.categoryService.categories$.subscribe((cats) => {
      this.categories = cats;
      this.applyFilter();
      if (cats && cats.length >= 0) this.isLoading = false;
    });
    this.categoryService.getAll().subscribe({
      next: () => {
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    if (!this.searchQuery.trim()) {
      this.filteredCategories = [...this.categories];
      return;
    }
    const q = this.searchQuery.toLowerCase().trim();
    this.filteredCategories = this.categories.filter(
      (c) => c.name?.toLowerCase().includes(q) || c.slug?.toLowerCase().includes(q) || c.uuid?.toLowerCase().includes(q)
    );
  }

  openCreate(): void {
    this.editingCategory = null;
    this.form.reset();
    this.showForm = true;
  }

  openEdit(cat: Category): void {
    this.editingCategory = cat;
    this.form.patchValue({ name: cat.name });
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingCategory = null;
  }

  submit(): void {
    if (this.form.invalid) return;
    this.isSubmitting = true;

    if (this.editingCategory) {
      this.categoryService.update(this.editingCategory._id, this.form.value).subscribe({
        next: () => {
          this.toast.show('Category updated successfully', 'success');
          this.closeForm();
          this.isSubmitting = false;
        },
        error: (err) => {
          this.toast.show(err.error?.message || 'Update failed', 'error');
          this.isSubmitting = false;
        }
      });
    } else {
      this.categoryService.create(this.form.value).subscribe({
        next: () => {
          this.toast.show('Category created successfully', 'success');
          this.closeForm();
          this.isSubmitting = false;
        },
        error: (err) => {
          this.toast.show(err.error?.message || 'Create failed', 'error');
          this.isSubmitting = false;
        }
      });
    }
  }

  delete(id: string): void {
    if (!confirm('Delete this category?')) return;
    this.categoryService.delete(id).subscribe({
      next: () => this.toast.show('Category deleted', 'success'),
      error: () => this.toast.show('Delete failed', 'error')
    });
  }
}
