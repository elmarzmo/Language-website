import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';

import { Auth } from './auth';
import { StudentOnboardingService } from '../services/student-onboarding-service';

@Injectable({
  providedIn: 'root',
})
export class StudentOnboardingGuard implements CanActivate {

  constructor(
    private authService: Auth,
    private studentOnboardingService: StudentOnboardingService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {

    // Make sure the user is logged in
    if (!this.authService.getToken()) {
      return of(this.router.createUrlTree(['/signin']));
    }

    // Make sure this is a student
    if (this.authService.getRole() !== 'STUDENT') {
      return of(this.router.createUrlTree(['/signin']));
    }

    return this.studentOnboardingService.getStudentOnboarding().pipe(

      map((onboarding) => {

        const currentRoute = route.routeConfig?.path;

        // Student is trying to access onboarding
        if (currentRoute === 'student/onboarding') {

          if (onboarding.profileCompleted) {
            return this.router.createUrlTree(['/student/enrollment']);
          }

          return true;
        }

        // Student is trying to access enrollment
        if (currentRoute === 'student/enrollment') {

          if (!onboarding.profileCompleted) {
            return this.router.createUrlTree(['/student/onboarding']);
          }

          if (onboarding.enrolled) {
            return this.router.createUrlTree(['/dashboard']);
          }

          return true;
        }

        return true;
      }),

      catchError(() => {
        return of(this.router.createUrlTree(['/student/onboarding']));
      })
    );
  }
}