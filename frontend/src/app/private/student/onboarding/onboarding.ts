import { Component, OnInit } from '@angular/core';
import { StudentOnboarding } from '../../../model/StudentOnboarding.model';
import { StudentOnboardingService } from '../../../services/student-onboarding-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-onboarding',
  imports: [CommonModule],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.css',
})
export class Onboarding implements OnInit {

  onboarding: StudentOnboarding = {
    englishLevel: null,
    profileCompletion: false,
  };

  loading = true;
  saving = false;
  errorMessage = '';

   levels = [
    {
      value: 'BEGINNER' as const,
      title: 'Beginner',
      description: 'I know some basic English words and phrases.'
    },
    {
      value: 'INTERMEDIATE' as const,
      title: 'Intermediate',
      description: 'I can communicate in English but want to improve.'
    },
    {
      value: 'ADVANCED' as const,
      title: 'Advanced',
      description: 'I communicate comfortably and want to become more fluent.'
    }
  ];

  constructor(
    private studentOnboardingService: StudentOnboardingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOnboarding();
  }

  loadOnboarding(): void {
    this.loading = true;

    this.studentOnboardingService.getStudentOnboarding().subscribe({
      next: (data) => {
        this.onboarding = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load onboarding data. Please try again later.';
        this.loading = false;
      }
    });
  }

  selectLevel(level: 'ADVANCED' | 'BEGINNER' | 'INTERMEDIATE' ): void {
    this.onboarding.englishLevel = level;
    this.errorMessage = '';
  }


  continue(): void {
    if (!this.onboarding.englishLevel) {
      this.errorMessage = 'Please select your English level before continuing.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    const data: StudentOnboarding = {
      englishLevel: this.onboarding.englishLevel,
      profileCompletion: true,
    };

    this.studentOnboardingService.updateStudentOnboarding(data).subscribe({
      next: () => {
        this.saving = false;

        // For now, continue to the dashboard.
        // Later this will go to the subscription/enrollment page.
        //TODO: Implement the subscription/enrollment page and redirect to it instead of the dashboard.
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.saving = false;
        this.errorMessage = 'Failed to save onboarding data. Please try again later.';
      }
    });
  }

}
