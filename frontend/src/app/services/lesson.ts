import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LessonModule, LiveClass, StudentProgress } from './lesson.model';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // ============ STUDENT ENDPOINTS ============

  /**
   * Get all active lessons for a student
   */
  getStudentLessons(studentId: string): Observable<LessonModule[]> {
    return this.http.get<LessonModule[]>(
      `${this.apiUrl}/lessons/student/${studentId}`
    );
  }

  /**
   * Get a specific lesson with all resources
   */
  getLesson(lessonId: string): Observable<LessonModule> {
    return this.http.get<LessonModule>(
      `${this.apiUrl}/lessons/${lessonId}`
    );
  }

  /**
   * Get upcoming live classes for a student
   */
  getUpcomingClasses(studentId: string): Observable<LiveClass[]> {
    return this.http.get<LiveClass[]>(
      `${this.apiUrl}/lessons/student/${studentId}/classes/upcoming`
    );
  }

  /**
   * Get student's progress in a lesson
   */
  getProgress(studentId: string, lessonId: string): Observable<StudentProgress> {
    return this.http.get<StudentProgress>(
      `${this.apiUrl}/lessons/${lessonId}/progress/${studentId}`
    );
  }

  /**
   * Mark a resource as viewed by student
   */
  markResourceViewed(studentId: string, lessonId: string, resourceId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/lessons/${lessonId}/resources/${resourceId}/view`,
      { studentId }
    );
  }

  /**
   * Join a live class
   */
  joinClass(classId: string): Observable<{ meetingLink: string }> {
    return this.http.post<{ meetingLink: string }>(
      `${this.apiUrl}/lessons/classes/${classId}/join`,
      {}
    );
  }

  // ============ TEACHER ENDPOINTS ============

  /**
   * Create a new lesson module
   */
  createLesson(lesson: Partial<LessonModule>): Observable<LessonModule> {
    return this.http.post<LessonModule>(
      `${this.apiUrl}/lessons`,
      lesson
    );
  }

  /**
   * Update an existing lesson
   */
  updateLesson(lessonId: string, updates: Partial<LessonModule>): Observable<LessonModule> {
    return this.http.put<LessonModule>(
      `${this.apiUrl}/lessons/${lessonId}`,
      updates
    );
  }

  /**
   * Delete a lesson
   */
  deleteLesson(lessonId: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/lessons/${lessonId}`
    );
  }

  /**
   * Add a resource to a lesson
   */
  addResource(lessonId: string, resource: Partial<any>): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/lessons/${lessonId}/resources`,
      resource
    );
  }

  /**
   * Update a resource
   */
  updateResource(lessonId: string, resourceId: string, updates: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/lessons/${lessonId}/resources/${resourceId}`,
      updates
    );
  }

  /**
   * Delete a resource
   */
  deleteResource(lessonId: string, resourceId: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/lessons/${lessonId}/resources/${resourceId}`
    );
  }

  /**
   * Schedule a live class for a lesson
   */
  scheduleLiveClass(lessonId: string, liveClass: Partial<LiveClass>): Observable<LiveClass> {
    return this.http.post<LiveClass>(
      `${this.apiUrl}/lessons/${lessonId}/classes`,
      liveClass
    );
  }

  /**
   * Update a scheduled live class
   */
  updateLiveClass(classId: string, updates: Partial<LiveClass>): Observable<LiveClass> {
    return this.http.put<LiveClass>(
      `${this.apiUrl}/lessons/classes/${classId}`,
      updates
    );
  }

  /**
   * Get all lessons created by a teacher
   */
  getTeacherLessons(teacherId: string): Observable<LessonModule[]> {
    return this.http.get<LessonModule[]>(
      `${this.apiUrl}/lessons/teacher/${teacherId}`
    );
  }

  /**
   * Publish a lesson (make it available to students)
   */
  publishLesson(lessonId: string, studentIds: string[]): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/lessons/${lessonId}/publish`,
      { studentIds }
    );
  }

  /**
   * Upload file for a resource (returns file path)
   */
  uploadFile(file: File): Observable<{ filePath: string; fileSize: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<{ filePath: string; fileSize: string }>(
      `${this.apiUrl}/upload`,
      formData
    );
  }

  /**
   * Get student progress in all lessons
   */
  getStudentAllProgress(studentId: string): Observable<StudentProgress[]> {
    return this.http.get<StudentProgress[]>(
      `${this.apiUrl}/lessons/student/${studentId}/progress`
    );
  }
}