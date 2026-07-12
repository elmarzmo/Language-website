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
      
        
        // Store user data in localStorage for dashboard
        const userId =  response.id ||response.token ||'';
        const userName = response.username || '';
        
        localStorage.setItem('userId', userId);
        localStorage.setItem('userName', userName);
        
        
        this.successMessage = 'Login successful! Redirecting...';

        // Use our new smart helper to route them correctly on login submit
        this.redirectToDashboard(response.role || null);

    },
      error: (error) => {
        this.isLoading = false;
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
        this.successMessage = 'Registration successful! Please log in.';
        
        // Clear signup form and switch to login
        setTimeout(() => {
          const savedEmail = this.signupData.email; // Save the email before clearing
          this.signupData = {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
          };
          this.activeTab = 'login';
          this.successMessage = '';
          this.loginData.email = savedEmail; // Pre-fill email in login form
        }, 500);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }


}