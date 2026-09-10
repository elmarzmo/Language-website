import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  
  private apiUrl = environment.apiUrl;


  constructor(private http: HttpClient) {}

  cancelSubscription(): Observable<any> {
    return this.http.post(`${this.apiUrl}/student/stripe/cancel`, {});
  }

  reactivateSubscription(): Observable<any> {
    return this.http.post(`${this.apiUrl}/student/stripe/reactivate`, {});
  }

  getSubscriptionStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/student/stripe/subscription-status`);
  }
}
