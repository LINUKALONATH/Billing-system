import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/purchase-bill']);
    }
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.success) {
          this.router.navigate(['/purchase-bill']);
        } else {
          this.errorMessage = response.message || 'Login failed.';
        }
      },
      error: (error: any) => {
        this.loading = false;
        if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please ensure the backend is running.';
        } else if (error.status === 401) {
          this.errorMessage = 'Invalid email or password.';
        } else {
          this.errorMessage = error.error?.message || 'Login failed.';
        }
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
