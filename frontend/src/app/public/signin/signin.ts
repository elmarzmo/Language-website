import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../guards/auth';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './signin.html',
  styleUrls: ['./signin.css'],
  host: { class: 'signin-host' }
})
export class Signin implements OnInit {
  // FIX 1: Added 'forgot' to the allowed union types
  activeTab: 'login' | 'signup' | 'forgot' = 'login';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  forgotPasswordEmail = '';
  debugResetLink = ''; // For debugging purposes only

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

  ngOnInit(): void {
    // If the user is already logged in, redirect them to the dashboard
    if (this.authService.isLoggedIn()) {
      this.redirectToDashboard(this.authService.getRole());
    }
  }

  private redirectToDashboard(role: string | null): void {
    if (role === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else if (role === 'TEACHER') {
      this.router.navigate(['/teacher/dashboard']);
    } else if (role === 'STUDENT') {
      this.router.navigate(['/dashboard']);
    }
  }

  // FIX 2: Updated parameter string layout to match activeTab properties
  switchTab(tab: 'login' | 'signup' | 'forgot'): void {
    this.activeTab = tab;
    this.errorMessage = '';
    this.successMessage = '';
    this.debugResetLink = '';
  }

  login(): void {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        const userId = response.id || response.resetToken || '';
        const userName = response.username || '';
        
        localStorage.setItem('userId', userId);
        localStorage.setItem('userName', userName);
        
        this.successMessage = 'Login successful! Redirecting...';
        this.redirectToDashboard(response.role || null);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'Login failed. Please try again.';
      }
    });
  }

  signup(): void {
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
        this.successMessage = 'Registration successful! Please log in.';
        
        setTimeout(() => {
          const savedEmail = this.signupData.email;
          this.signupData = {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
          };
          this.activeTab = 'login';
          this.successMessage = '';
          this.loginData.email = savedEmail;
        }, 500);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  sendForgotPassword(): void {
    if (!this.forgotPasswordEmail) {
      this.errorMessage = 'Please enter your email address.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.debugResetLink = '';

    this.authService.forgotPassword(this.forgotPasswordEmail).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message || 'If that email exists, a reset link has been generated.';
        
        if (response.DEBUG_ONLY_resetLink) {
          this.debugResetLink = response.DEBUG_ONLY_resetLink;
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'Failed to submit request. Please try again.';
      }
    });
  }
}