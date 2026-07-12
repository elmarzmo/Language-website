import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from './auth'; // Adjust path to your auth.ts file
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

// BehaviorSubject to track if we are already refreshing a token
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(Auth);
  const http = inject(HttpClient);
  const token = authService.getToken();

  // 1. Add Access token to requests if it exists
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // 2. Process the request and handle errors
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Check for 401 and bypass refresh endpoint to avoid an infinite loop
      if (error.status === 401 && !req.url.includes('/auth/refresh')) {
        return handle401Error(authReq, next, authService, http);
      }
      return throwError(() => error);
    })
  );
};

// Helper function to handle token refresh and request retries
function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: Auth,
  http: HttpClient
): Observable<HttpEvent<unknown>> {
  
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const refreshToken = localStorage.getItem('RefreshToken');

    if (!refreshToken) {
      authService.logout();
      return throwError(() => new Error('No refresh token available.'));
    }

    // Fixed: Using environment.apiUrl directly instead of 'this.apiUrl'
    const refreshUrl = `${environment.apiUrl}/auth/refresh`;

    return http.post<{ accessToken: string }>(refreshUrl, { refreshToken }).pipe(
      switchMap((res) => {
        isRefreshing = false;
        
        localStorage.setItem('Token', res.accessToken);
        refreshTokenSubject.next(res.accessToken);

        return next(request.clone({
          setHeaders: { Authorization: `Bearer ${res.accessToken}` }
        }));
      }),
      catchError((refreshError) => {
        isRefreshing = false;
        authService.logout();
        return throwError(() => refreshError);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((jwt) => {
        return next(request.clone({
          setHeaders: { Authorization: `Bearer ${jwt}` }
        }));
      })
    );
  }
}