import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../../../guards/auth';
import { StudentOnboardingService } from '../../../services/student-onboarding-service';

@Component({
  selector: 'app-oauth-success',
  imports: [],
  templateUrl: './oauth-success.html',
  styleUrl: './oauth-success.css',
})
export class OauthSuccess implements OnInit {

  constructor(
    private authService: Auth, 
    private route: ActivatedRoute, 
    private router: Router,
  
    private studentOnboardingService: StudentOnboardingService

  ) { }

  ngOnInit(): void {
    
      const token = this.route.snapshot.queryParamMap.get('token');
      const refreshToken = this.route.snapshot.queryParamMap.get('refreshToken');
      if (!token || !refreshToken) {
        this.router.navigate(['/signin']);
        return;
      }

    
      localStorage.setItem('Token', token);
      localStorage.setItem('RefreshToken', refreshToken);


      // Ask backend who this user is

      this.authService.getCurrentUser().subscribe({

        next: (user: any) => {
          this.authService.saveAuthData(token, refreshToken, user);

          // admin
          if (user.role === 'ADMIN') {
            this.router.navigate(['/admin']);
            return;
          }
          if (user.role === 'TEACHER') {
            this.router.navigate(['/teacher/dashboard']);
            return;
          }
          if (user.role === 'STUDENT') {

            this.studentOnboardingService.getStudentOnboarding().subscribe({
              next: (onboardingData: any) => {

                // student has not completed onboarding
                if(!onboardingData.profileCompleted){
                  this.router.navigate(['/student/onboarding']);
                  return;
                }

                // profile completed but not enrolled
                if(!onboardingData.enrolled){
                  this.router.navigate(['/student/enrollment']);
                  return;
                }

                // fully onboarded student
                // fully onboarded student, navigate to dashboard
               
                this.router.navigate(['/dashboard']);
                
              },
              error: () => {
                // If onboarding record cannot be loaded,
                //  // send student to onboarding
                this.router.navigate(['/student/onboarding']); 
              } 
            });

            return;
          }

          // Unknown role, redirect to signin
          localStorage.removeItem('Token');
          localStorage.removeItem('RefreshToken');
          this.router.navigate(['/signin']);
        },
        error: () => {
          localStorage.removeItem('Token');
          localStorage.removeItem('RefreshToken');
          this.router.navigate(['/signin']);
        }
      });
         

   
  }


}


