import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface AuthResponse {
  id?: string; // user id or token id
  token?: string;
  resetToken?: string;
  refreshToken?: string;
  message?: string;
  success?: boolean;
  error?: string;
  username?: string; // for storing in dashboard
  email?: string; // for storing in dashboard
  role?: string;
  DEBUG_ONLY_resetLink?: string; // for debugging purposes only

}

@Injectable({
  providedIn: 'root',
})
export class Auth {
    private apiUrl = environment.apiUrl;
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, {
      username,
      email,
      password
    });
  }

  

  login(email: string, password: string, rememberMe: boolean): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, {
      email,
      password
    }).pipe(
      tap((response: AuthResponse) => {
        if(response.token) {

          ['Token', 'RefreshToken', 'Role', 'userId', 'userName'].forEach(key => {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
          });

          const storage = rememberMe ? localStorage : sessionStorage;

          storage.setItem('Token', response.token);

          if (response.refreshToken) {
            storage.setItem('RefreshToken', response.refreshToken);
          }

          if (response.role) {
            storage.setItem('Role', response.role);
          }

          if(response.id) {
            storage.setItem('userId', response.id);
          }

          if(response.username) {
            storage.setItem('userName', response.username);
          }

          this.isLoggedInSubject.next(true);
        }
      })
    );
  }

  logout(): void {
    const refreshToken = localStorage.getItem('RefreshToken') ?? sessionStorage.getItem('RefreshToken');
    const clearAuthData = () => {
      ['Token', 'RefreshToken', 'Role', 'userId', 'userName'].forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      
      this.isLoggedInSubject.next(false);
    };

    clearAuthData();

    if (!refreshToken) {
      return;
    }

    this.http.post<AuthResponse>(`${this.apiUrl}/auth/logout`, { refreshToken }).subscribe({
      next: () => {
        console.log('Logout successful');
      },
      error: () => {
        console.warn('Logout request failed, but local auth session was cleared.');
      }
    });
  }

  
  forgotPassword(email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(resetToken: string, newPassword: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/reset-password`, { resetToken, newPassword });
  }

  getToken(): string | null {
    return localStorage.getItem('Token')??
    sessionStorage.getItem('Token');
  }

  getRole(): string | null {
    return localStorage.getItem('Role')??

    sessionStorage.getItem('Role');
  }

  private hasToken(): boolean {
    return !! (localStorage.getItem('Token') || sessionStorage.getItem('Token'));
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  getCurrentUser() {
  return this.http.get(
    `${this.apiUrl}/auth/current-user`,
    {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    }
  );
}

  getUserId(): string | null {
    return localStorage.getItem('userId') ?? sessionStorage.getItem('userId');
  }

  getUserName(): string | null {
    return localStorage.getItem('userName') ?? sessionStorage.getItem('userName');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('RefreshToken') ?? sessionStorage.getItem('RefreshToken');
  }

  updateAccessToken(token: string): void {
    if (localStorage.getItem('Token')) {
      localStorage.setItem('Token', token);
    } else {
      sessionStorage.setItem('Token', token);
    }
  }

  saveAuthData(token: string, refreshToken: string, user: any): void {

    ['Token', 'RefreshToken', 'Role', 'userId', 'userName'].forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);

    });
    localStorage.setItem('Token', token);
    localStorage.setItem('RefreshToken', refreshToken);
    localStorage.setItem('Role', user.role);
    localStorage.setItem('userId', user.id);
    localStorage.setItem('userName', user.username);

    this.isLoggedInSubject.next(true);
  }

  loginWithGoogle(): void {
 
     window.location.assign(`${environment.oauth2AuthorizationUrl}`);
  }
}