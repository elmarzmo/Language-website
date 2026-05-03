import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ClassSession } from '../models/class-session.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class ClassSessionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createClassSession(session: ClassSession) {
    return this.http.post(`${this.apiUrl}/class-sessions`, session);
  }

  getSessionsByStudent(studentId: number) {
    return this.http.get(`${this.apiUrl}/class-sessions/students/${studentId}`);
  }


  getSessionsByTeacher(teacherId: number) {
    return this.http.get(`${this.apiUrl}/class-sessions/teachers/${teacherId}`);
  }

  updateClassSession(sessionId: number, session: ClassSession) {
    return this.http.put(`${this.apiUrl}/class-sessions/${sessionId}`, session);
  }

  getAllSessions(): Observable<ClassSession[]> {
    return this.http.get<ClassSession[]>(`${this.apiUrl}/class-sessions/all`);
  }

}
