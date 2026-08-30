import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Auth } from '../../guards/auth';
import { environment } from '../../../environments/environment';
import { StudentOnboardingService } from '../../services/student-onboarding-service';


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

  rememberMe = false; // For "Remember Me" functionality
  termsAccepted= false;

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
    private router: Router,
    private route: ActivatedRoute,
    private studentOnboardingService: StudentOnboardingService
  ) {}

  ngOnInit(): void {
    // If the user is already logged in, redirect them to the dashboard
    if (this.authService.isLoggedIn()) {
      this.redirectToDashboard(this.authService.getRole());
      return;
    }

    // Check for the 'action' query parameter
    this.route.queryParams.subscribe((params) => {
      const action = params['action'];
      if (action === 'signup') {
        this.activeTab = 'signup';
      }
      else if (action === 'forgot') {
        this.activeTab = 'forgot';
      }
      else {
        this.activeTab = 'login';
      }
    });
  }

  private redirectToDashboard(role: string | null): void {
    if (role === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else if (role === 'TEACHER') {
      this.router.navigate(['/teacher/dashboard']);
    } else if (role === 'STUDENT') {

      this.studentOnboardingService.getStudentOnboarding().subscribe({
        next: (onboarding) => {
          if(!onboarding.profileCompleted){
            this.router.navigate(['/student/onboarding']);
            return;
          }

          if(!onboarding.enrolled) {

            this.router.navigate(['/student/enrollment']);
            return;
          }
                this.router.navigate(['/dashboard']);


        },
        error: () => {
          this.router.navigate(['/student/onboarding']);
        }
      });
      return;

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

    this.authService.login(this.loginData.email, this.loginData.password, this.rememberMe).subscribe({
      next: (response) => {
        this.isLoading = false;
        
      
        
        this.successMessage = 'Login successful! Redirecting...';
        this.redirectToDashboard(this.authService.getRole());
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

    if (!this.termsAccepted) {
      this.errorMessage = 'Please agree to the Terms of Service and Privacy Policy before creating your account.';
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
        this.errorMessage = error.error?.error || 'Registration failed. Please try again.';
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
        
        //TODO: Remove this in production
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

 loginWithGoogle(): void {
  const url = environment.oauth2AuthorizationUrl;

  console.log("Google login clicked");
  console.log("Redirecting to:", url);

  window.location.href = url;
}

  navigateToSignup(): void {
     this.router.navigate(['/signin'], { queryParams: { action: 'signup' } });
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }
}