import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LessonModule } from './lesson.model';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllLessons(){
    return this.http.get<LessonModule[]>(`${this.apiUrl}/admin/lessons`);
  }

  getStudentLessons(){
    return this.http.get<LessonModule[]>(`${this.apiUrl}/dashboard/student/lessons`);
  }
  createLesson(lesson: LessonModule) {
  return this.http.post(`${this.apiUrl}/admin/lessons/create`, lesson);  
  } 

    
  deleteLesson(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/lessons/${id}`);
  }

  getLessonsById(id: string): Observable<LessonModule> {
    return this.http.get<LessonModule>(`${this.apiUrl}/admin/lessons/${id}`);
  }

  updateLesson(id: string, lesson: LessonModule): Observable<LessonModule> {
    return this.http.put<LessonModule>(`${this.apiUrl}/admin/lessons/${id}`, lesson)
  }
}