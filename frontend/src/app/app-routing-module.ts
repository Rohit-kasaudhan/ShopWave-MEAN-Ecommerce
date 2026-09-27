import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './features/auth/register/register.component';
import { LoginComponent } from './features/auth/login/login.component';
import { VerifyEmailComponent } from './features/auth/verify-email/verify-email.component';
import { HomeComponent } from './features/home/home.component';
import { ProductsComponent } from './features/products/products.component';
import { ProductDetailComponent } from './features/products/product-detail/product-detail.component';
import { CartComponent } from './features/cart/cart.component';
import { OrdersComponent } from './features/orders/orders.component';
import { AdminComponent } from './features/admin/admin.component';

import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'ShopWave — Home' },
  { path: 'products', component: ProductsComponent, title: 'ShopWave — Products' },
  { path: 'products/:id', component: ProductDetailComponent, title: 'ShopWave — Product Detail' },

  // Auth
  { path: 'register', component: RegisterComponent, title: 'ShopWave — Register' },
  { path: 'verify-email', component: VerifyEmailComponent, title: 'ShopWave — Verify Email' },
  { path: 'login', component: LoginComponent, title: 'ShopWave — Login' },

  // User Dashboard
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard], title: 'ShopWave — Cart' },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard], title: 'ShopWave — My Purchases' },

  // Admin Dashboard
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard], title: 'ShopWave — Admin Panel' },

  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
