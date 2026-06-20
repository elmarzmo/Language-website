import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClassSession } from '../model/classSession.model';

@Injectable({
  providedIn: 'root',
})
export class ClassSessionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSessionsByTeacher(teacherId: string): Observable<ClassSession[]> {
    return this.http.get<ClassSession[]>(`${this.apiUrl}/teacher/sessions?teacherId=${teacherId}`);

  }

  updateSession(sessionId: string, payload: Partial<ClassSession>): Observable<ClassSession> {
    return this.http.put<ClassSession>(`${this.apiUrl}/teacher/sessions/${sessionId}/update`, payload);
  }
  
}
