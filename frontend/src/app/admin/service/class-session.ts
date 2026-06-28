import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ClassSession } from '../models/class-session.model';
import { Observable } from 'rxjs';
import { ClassSessionList } from '../../model/ClassSessionList.model';

@Injectable({
  providedIn: 'root',
})
export class ClassSessionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createClassSession(session: ClassSession): Observable<ClassSession> {
    return this.http.post<ClassSession>(`${this.apiUrl}/class-sessions`, session);
  }

  getAllSessions(): Observable<ClassSession[]> {
    return this.http.get<ClassSession[]>(`${this.apiUrl}/class-sessions/all`);
  }

  getAllClassSessions(): Observable<ClassSessionList[]> {
    return this.http.get<ClassSessionList[]>(`${this.apiUrl}/admin/classes-list`);
  }
  getSessionsByStudent(studentId: string): Observable<ClassSession[]> {
    return this.http.get<ClassSession[]>(`${this.apiUrl}/class-sessions/students/${studentId}`);
  }

  getSessionsByTeacher(teacherId: string): Observable<ClassSession[]> {
    return this.http.get<ClassSession[]>(`${this.apiUrl}/class-sessions/teachers/${teacherId}`);
  }

  updateClassSession(sessionId: string, session: ClassSession): Observable<ClassSession> {
    return this.http.put<ClassSession>(`${this.apiUrl}/class-sessions/${sessionId}`, session);
  }

  deleteClassSession(sessionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/class-sessions/${sessionId}`);
  }

  

}