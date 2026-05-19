import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cohort ,CohortLevel } from '../../models/cohort.model';
import { CohortService } from '../../service/cohort.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-cohort',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-cohort.html',
  styleUrl: './create-cohort.css',
})
export class CreateCohort implements OnInit {
 
  cohortForm!: FormGroup;

  isSubmitting = false;

  successMessage = '';
  errorMessage = '';

  levels: CohortLevel[] = [
    'ADVANCED',
    'BEGINNER',
    'INTERMEDIATE'
  ];

  constructor(
    private fb: FormBuilder,
    private cohortService: CohortService
  ) {}

  ngOnInit(): void {
    this.cohortForm = this.fb.group({
      name: ['', Validators.required],
      level: ['BEGINNER', Validators.required],
      maxStudents: [6,[Validators.required, Validators.min(1)]],
      teacherId: ['', Validators.required],
      startDate: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.cohortForm.invalid) {
      this.cohortForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;

    const cohort: Cohort = {
      ...this.cohortForm.value
    };

    this.cohortService.createCohort(cohort)
      .subscribe({
        next: () => {
          this.successMessage = 'Cohort created successfully';
          this.errorMessage = '';
          this.isSubmitting = false;

          this.cohortForm.reset({
            level: 'BEGINNER',
            maxStudents: 5
          });
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Failed to create cohort';
          this.successMessage = '';
          this.isSubmitting = false;
        }
      });

  }
}
