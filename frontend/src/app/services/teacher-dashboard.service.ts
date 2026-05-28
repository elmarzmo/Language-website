import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeacherDashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient){}

  getTeacherDashboard(): Observable<any>{
    return this.http.get(`${this.apiUrl}/teacher/dashboard`);
  }
  getTeacherLessons(): Observable<any>{
    return this.http.get(`${this.apiUrl}/teacher/resources`);
  }
}
