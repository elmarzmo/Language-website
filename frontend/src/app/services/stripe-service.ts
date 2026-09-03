import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface StripeCheckoutResponse {
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class StripeService {

  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createCheckoutSession(): Observable<StripeCheckoutResponse> {
    return this.http.post<StripeCheckoutResponse>(
      `${this.apiUrl}/student/stripe/create-checkout-session`,
      {}
    );
  }
}