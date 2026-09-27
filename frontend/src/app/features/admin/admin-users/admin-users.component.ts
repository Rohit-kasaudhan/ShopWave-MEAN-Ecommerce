import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { AuthService, User } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-users',
  standalone: false,
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchQuery = '';
  roleFilter = 'all';
  isLoading = true;

  showForm = false;
  isSubmitting = false;
  editingUser: User | null = null;
  userForm!: FormGroup;
  currentUser: User | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.initForm();

    this.userService.users$.subscribe((u) => {
      this.users = u;
      this.applyFilter();
      if (u && u.length >= 0) this.isLoading = false;
    });

    this.userService.getAll().subscribe({
      next: (res) => {
        this.users = res.data ?? [];
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      FirstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      LastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^(010|011|012|015)[0-9]{8}$/)]],
      gender: ['male', [Validators.required]],
      birthDate: ['', [Validators.required]],
      role: ['user', [Validators.required]],
      password: [''],
      confirmPassword: ['']
    });
  }

  applyFilter(): void {
    let result = [...this.users];

    if (this.roleFilter !== 'all') {
      result = result.filter((u) => u.role === this.roleFilter);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(
        (u) =>
          u.FirstName?.toLowerCase().includes(q) ||
          u.LastName?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.phone?.toLowerCase().includes(q)
      );
    }

    this.filteredUsers = result;
  }

  openCreate(): void {
    this.editingUser = null;
    this.userForm.reset({
      gender: 'male',
      role: 'user'
    });

    // Set password validators for create mode
    const passControl = this.userForm.get('password');
    const confirmControl = this.userForm.get('confirmPassword');
    passControl?.setValidators([
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/)
    ]);
    confirmControl?.setValidators([Validators.required]);
    passControl?.updateValueAndValidity();
    confirmControl?.updateValueAndValidity();

    this.showForm = true;
  }

  openEdit(u: User): void {
    this.editingUser = u;

    // Clear password validators for edit mode
    const passControl = this.userForm.get('password');
    const confirmControl = this.userForm.get('confirmPassword');
    passControl?.clearValidators();
    confirmControl?.clearValidators();
    passControl?.updateValueAndValidity();
    confirmControl?.updateValueAndValidity();

    const formattedBirthDate = u.birthDate ? u.birthDate.split('T')[0] : '';

    this.userForm.patchValue({
      FirstName: u.FirstName,
      LastName: u.LastName,
      email: u.email,
      phone: u.phone,
      gender: u.gender || 'male',
      birthDate: formattedBirthDate,
      role: u.role || 'user',
      password: '',
      confirmPassword: ''
    });

    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingUser = null;
    this.userForm.reset();
  }

  submit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const val = this.userForm.value;

    if (!this.editingUser) {
      if (val.password !== val.confirmPassword) {
        this.toast.show('Passwords do not match', 'error');
        return;
      }
    }

    this.isSubmitting = true;

    if (this.editingUser) {
      const payload: Partial<User> = {
        FirstName: val.FirstName,
        LastName: val.LastName,
        email: val.email,
        phone: val.phone,
        gender: val.gender,
        birthDate: val.birthDate,
        role: val.role
      };

      this.userService.update(this.editingUser.uuid, payload).subscribe({
        next: () => {
          this.toast.show('User updated successfully', 'success');
          this.closeForm();
          this.isSubmitting = false;
        },
        error: (err) => {
          this.toast.show(err.error?.message || 'Failed to update user', 'error');
          this.isSubmitting = false;
        }
      });
    } else {
      this.userService.create(val).subscribe({
        next: () => {
          this.toast.show('User created successfully', 'success');
          this.closeForm();
          this.isSubmitting = false;
        },
        error: (err) => {
          this.toast.show(err.error?.message || 'Failed to create user', 'error');
          this.isSubmitting = false;
        }
      });
    }
  }

  deleteUser(uuid: string): void {
    if (uuid === this.currentUser?.uuid) {
      this.toast.show('You cannot delete your own admin account', 'error');
      return;
    }

    if (!confirm('Are you sure you want to delete this user?')) return;

    this.userService.delete(uuid).subscribe({
      next: () => this.toast.show('User deleted successfully', 'success'),
      error: (err) => this.toast.show(err.error?.message || 'Failed to delete user', 'error')
    });
  }
}
