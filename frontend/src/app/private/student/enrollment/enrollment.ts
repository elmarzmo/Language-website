import { Component } from '@angular/core';
import { VoucherService } from '../../../services/voucher-service';

import { VoucherValidationResponse } from '../../../model/voucher.model';

import { EnrollmentService } from '../../../services/enrollment-service';

import { EnrollmentResponse } from '../../../model/enrollment.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

@Component({
  selector: 'app-enrollment',
  imports: [CommonModule, FormsModule],
  templateUrl: './enrollment.html',
  styleUrl: './enrollment.css',
})
export class Enrollment {

  readonly planId = '6a8bd67360bf3bab41d1c72b';
  readonly planName = 'Standard Monthly';
  readonly monthlyPrice = 29;

  voucherCode = '';

  voucherApplied = false;
  discountAmount = 0;

  voucherMessage = '';
  voucherError = '';

  isValidatingVoucher = false;
  isEnrolling = false;

  enrollmentError = '';

  constructor(
    private voucherService: VoucherService,
    private enrollmentService: EnrollmentService,
    private router: Router
  ){}

   get total(): number {
    return Math.max(
      0,
      this.monthlyPrice - this.discountAmount
    );
  }

   validateVoucher(): void {

    this.voucherError = '';
    this.voucherMessage = '';
    this.voucherApplied = false;
    this.discountAmount = 0;

    const code = this.voucherCode.trim();

    if (!code) {
      this.voucherError = 'Please enter a voucher code.';
      return;
    }

    this.isValidatingVoucher = true;

    this.voucherService.validateVoucher(code).subscribe({
      next: (response: VoucherValidationResponse) => {

        this.isValidatingVoucher = false;

        if (response.valid) {

          this.voucherApplied = true;
          this.discountAmount = response.discountAmount;
          this.voucherMessage = response.message;

        } else {

          this.voucherError = response.message;
        }
      },

      error: (error) => {

        this.isValidatingVoucher = false;

        this.voucherError =
          error.error?.error ||
          'Unable to validate voucher.';
      }
    });
  }

   enroll(): void {

    this.enrollmentError = '';

    this.isEnrolling = true;

    this.enrollmentService.enroll({
      planId: this.planId,
      voucherCode: this.voucherApplied
        ? this.voucherCode.trim()
        : undefined
    }).subscribe({

      next: (response: EnrollmentResponse) => {

        this.isEnrolling = false;

        

        this.router.navigate(['/dashboard']);
      },

      error: (error) => {

        this.isEnrolling = false;

        this.enrollmentError =
          error.error?.error ||
          'Unable to complete enrollment.';
      }
    });
  }


}
