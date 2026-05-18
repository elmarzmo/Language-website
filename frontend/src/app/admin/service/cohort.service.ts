import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Cohort } from '../models/cohort.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CohortService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createCohort(cohort: Cohort): Observable<Cohort> {
    return this.http.post<Cohort>(`${this.apiUrl}/admin/cohorts`,cohort);
  }

  getAllCohorts(): Observable<Cohort[]>{
    return this.http.get<Cohort[]>(`${this.apiUrl}/admin/cohorts`);
  }
  
}
