import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './signin.html',
  styleUrls: ['./signin.css'],
  host: { class: 'signin-host' }
})
export class Signin {
  activeTab: 'login' | 'signup' = 'login';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Login
  loginData = {
    username: '',
    password: ''
  };

  // Signup
  signupData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  switchTab(tab: 'login' | 'signup'): void {
    this.activeTab = tab;
    this.errorMessage = '';
    this.successMessage = '';
  }

  login(): void {
    // Validation
    if (!this.loginData.username || !this.loginData.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData.username, this.loginData.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Login successful:', response);
        this.successMessage = 'Login successful! Redirecting...';
        
        // Clear form and redirect after a short delay
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 500);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login failed:', error);
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
      }
    });
  }

  signup(): void {
    // Validation
    if (!this.signupData.username || !this.signupData.email || !this.signupData.password || !this.signupData.confirmPassword) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.signupData.password !== this.signupData.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.signupData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(
      this.signupData.username,
      this.signupData.email,
      this.signupData.password
    ).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Registration successful:', response);
        this.successMessage = 'Registration successful! Please log in.';
        
        // Clear signup form and switch to login
        setTimeout(() => {
          this.signupData = {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
          };
          this.activeTab = 'login';
          this.successMessage = '';
          this.loginData.username = this.signupData.username;
        }, 500);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Registration failed:', error);
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}