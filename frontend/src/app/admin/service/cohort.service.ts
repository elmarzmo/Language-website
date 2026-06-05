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

  getCohortById(id: string): Observable<Cohort> {
    return this.http.get<Cohort>(`${this.apiUrl}/admin/cohorts/${id}`);
  }
  
  addStudentToCohort(cohortId: string, studentId: string): Observable<Cohort> {
    return this.http.post<Cohort>(`${this.apiUrl}/admin/cohorts/${cohortId}/students`, { studentId });
  }

  removeStudentFromCohort(cohortId: string, studentId: string): Observable<Cohort> {
    return this.http.delete<Cohort>(`${this.apiUrl}/admin/cohorts/${cohortId}/students/${studentId}`);
  }

  updateCohort(cohortId: string, payload: Partial<Cohort>): Observable<Cohort> {
    return this.http.put<Cohort>(`${this.apiUrl}/admin/cohorts/${cohortId}/update`, payload);
  }
}
