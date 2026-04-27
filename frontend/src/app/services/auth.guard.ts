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
    console.log('AuthGuard check - Token:', token);
    
    if (token) {
      return true;
    }

    // Not logged in, redirect to signin
    this.router.navigate(['/signin']);
    return false;
  }
}