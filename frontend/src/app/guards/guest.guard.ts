import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  canActivate(): boolean {

    const token = this.authService.getToken();

    // User is not logged in → allow access to public page
    if (!token) {
      return true;
    }

    // User is already logged in → send them to their dashboard
    const role = this.authService.getRole();

    if (role === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else if (role === 'TEACHER') {
      this.router.navigate(['/teacher/dashboard']);
    } else if (role === 'STUDENT') {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/signin']);
    }

    return false;
  }
}