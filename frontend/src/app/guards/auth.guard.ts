import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = this.auth.getToken();
   
    // 1. Check if the user is logged in at all
    if (!token) {
      this.router.navigate(['/signin']);
      return false;
    }

    // 2. Check if the route requires a specific role
    const expectedRoles = route.data['roles'] as Array<string>;
    
    // If no roles are specified for the route, just being logged in is enough
    if (!expectedRoles || expectedRoles.length === 0) {
      return true;
    }

    // Get the current user's role from your Auth service
    const userRole = this.auth.getRole(); 

    // Check if the user's role matches one of the allowed roles for this route
    if (userRole && expectedRoles.includes(userRole)) {
      return true;
    }

    
    if (userRole === 'ADMIN') {
  
      this.router.navigate(['/admin']);

    } else if (userRole === 'TEACHER') {

      this.router.navigate(['/teacher/dashboard']);

    } else if (userRole === 'STUDENT') {

      this.router.navigate(['/dashboard']);

    } else {

      // Catch-all fallback just in case the role string is corrupt or missing

      this.router.navigate(['/signin']);

    }
    return false;
  }
}