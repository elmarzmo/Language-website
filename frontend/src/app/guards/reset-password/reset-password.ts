import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../auth';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css']
})
export class ResetPassword implements OnInit {
  resetForm: FormGroup;
  token: string | null = null;
  loading = false;
  errorMessage = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: Auth
  ) {
    // Initialize Reactive Form with validators
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Extract token from URL (e.g., /reset-password?token=xyz)
    this.token = this.route.snapshot.queryParamMap.get('token');
    
    if (!this.token) {
      this.errorMessage = 'Invalid or missing reset token. Please request a new link.';
    }
  }

  // Custom validator to ensure passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('newPassword')?.value;
    const confirm = control.get('confirmPassword')?.value;
    
    if (password && confirm && password !== confirm) {
      return { mismatch: true };
    }
    return null;
  }

  onSubmit(): void {

    if (this.resetForm.invalid || !this.token) return;

    this.loading = true;
    this.errorMessage = '';

    const newPassword = this.resetForm.get('newPassword')?.value;

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to reset password. Token may be expired.';
        this.loading = false;
      }
    });

  }
}