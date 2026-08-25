import { Injectable } from '@angular/core';
import { SubscriptionPlan } from '../model/subscription.model';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionPlanService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient){}

  getActivePlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(`${this.apiUrl}/subscription-plans`);
  }
  
}
