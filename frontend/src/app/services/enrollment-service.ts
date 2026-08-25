import { Injectable } from '@angular/core';
import { EnrollmentRequest, EnrollmentResponse } from '../model/enrollment.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient){}


  enroll(request: EnrollmentRequest): Observable<EnrollmentResponse> {
    return this.http.post<EnrollmentResponse>(`${this.apiUrl}/student/enrollment`, request);
  }
}
