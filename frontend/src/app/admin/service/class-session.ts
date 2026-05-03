import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ClassSession {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createClassSession(session: any) {
    return this.http.post(`${this.apiUrl}/class-sessions`, session);
  }

  getSessionsByStudent(studentId: number) {
    return this.http.get(`${this.apiUrl}/class-sessions/students/${studentId}`);
  }


  getSessionsByTeacher(teacherId: number) {
    return this.http.get(`${this.apiUrl}/class-sessions/teachers/${teacherId}`);
  }

  updateClassSession(sessionId: number, session: any) {
    return this.http.put(`${this.apiUrl}/class-sessions/${sessionId}`, session);
  }

  getAllSessions() {
    return this.http.get(`${this.apiUrl}/class-sessions/all`);
  }

}
