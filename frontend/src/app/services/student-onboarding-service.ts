import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentOnboarding } from '../model/StudentOnboarding.model';



@Injectable({
  providedIn: 'root',
})
export class StudentOnboardingService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {}
  

  getStudentOnboarding(): Observable<StudentOnboarding> {
    return this.http.get<StudentOnboarding>(`${this.apiUrl}/student/onboarding`);
  }


  updateStudentOnboarding( studentOnboarding: StudentOnboarding): Observable<StudentOnboarding> {
    return this.http.put<StudentOnboarding>(`${this.apiUrl}/student/onboarding`, studentOnboarding);
  }
}
