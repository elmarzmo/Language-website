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
    email: '',
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
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Login successful:', response);
        
        // Store user data in localStorage for dashboard
        const studentId = response.id || response.email || '';
        const studentName = response.username || '';
        
        localStorage.setItem('studentId', studentId);
        localStorage.setItem('studentName', studentName);
        
        console.log('Stored studentId:', localStorage.getItem('studentId'));
        console.log('Stored studentName:', localStorage.getItem('studentName'));
        console.log('Token in localStorage:', this.authService.getToken());
        
        this.successMessage = 'Login successful! Redirecting...';
        
        // Navigate immediately
        this.router.navigate(['/dashboard']).then(success => {
          console.log('Navigation result:', success);
        });
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
          this.loginData.email = this.signupData.email; // Pre-fill email in login form
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