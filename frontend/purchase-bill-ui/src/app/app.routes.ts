import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'purchase-bill',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/purchase-bill/purchase-bill.component').then(m => m.PurchaseBillComponent)
  },
  { path: '**', redirectTo: 'login' }
];
