import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Cohort } from '../model/cohort.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CohortService {
    private apiUrl = environment.apiUrl;

      constructor(private http: HttpClient) { }


      getAllCohorts(): Observable<Cohort[]>{
          return this.http.get<Cohort[]>(`${this.apiUrl}/admin/cohorts`);
        }

      updateCohort(cohortId: string, payload: Partial<Cohort>): Observable<Cohort> {
          return this.http.put<Cohort>(`${this.apiUrl}/admin/cohorts/${cohortId}/update`, payload);
        }
  
}
