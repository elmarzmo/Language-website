import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

interface AuthResponse {
  token?: string;
  refreshToken?: string;
  message?: string;
  success?: boolean;
  error?: string;
  id?: string; // user id or token id
  username?: string; // for storing in dashboard
  email?: string; // for storing in dashboard
  role?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:8080/api/auth';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, {
      username,
      email,
      password
    });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, {
      email,
      password
    }).pipe(
      tap((response: AuthResponse) => {
        if (response.token) {
          localStorage.setItem('Token', response.token);
          if (response.refreshToken) {
            localStorage.setItem('RefreshToken', response.refreshToken);
          }

          if (response.role) {
            localStorage.setItem('Role', response.role);
          }
          this.isLoggedInSubject.next(true);
        }
      })
    );
  }

  logout(): void {
    const refreshToken = localStorage.getItem('RefreshToken');
    const clearAuthData = () => {
      localStorage.removeItem('Token');
      localStorage.removeItem('RefreshToken');
      localStorage.removeItem('Role');
      this.isLoggedInSubject.next(false);
    };

    clearAuthData();

    if (!refreshToken) {
      return;
    }

    this.http.post<AuthResponse>(`${this.apiUrl}/logout`, { refreshToken }).subscribe({
      next: () => {
        console.log('Logout successful');
      },
      error: () => {
        console.warn('Logout request failed, but local auth session was cleared.');
      }
    });
  }

  getToken(): string | null {
    return localStorage.getItem('Token');
  }

  getRole(): string | null {
    return localStorage.getItem('Role');
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('Token');
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  getCurrentUser() {
    return this.http.get(`${this.apiUrl}/current-user`);
  }
}