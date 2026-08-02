import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../../../guards/auth';
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
    private router: Router) { }

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
          
          switch (user.role) {
            case 'ADMIN':
              this.router.navigate(['/admin']);
              break;
            case 'TEACHER':
              this.router.navigate(['/teacher/dashboard']);
              break;
            
            default:
              this.router.navigate(['/dashboard']);
          }
        },
        error: () => {
          localStorage.removeItem('Token');
          localStorage.removeItem('RefreshToken');
          this.router.navigate(['/signin']);
        }
      });
  }


}


