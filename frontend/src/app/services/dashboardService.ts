import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


export interface ClassSession {
  id: string;
  teacherId: string;
  studentIds: string[];
  lessonModuleId: string;
  dateTime: string; // ISO format
  duration: number; // in minutes
  meetingLink: string;
  status: 'scheduled' | 'ongoing' | 'completed';
}

export interface StudentProgress {
  id: string;
  studentId: string;
  lessonModuleId: string;
  progressPercentage: number;
  completionStatus: 'not started' | 'in progress' | 'completed';
  lastUpdated: string; // ISO format
  
}

export interface StudentDashboard{
  upcomingClasses: ClassSession[];
  progressList: StudentProgress[];

}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getStudentDashboard(studentId: string): Observable<StudentDashboard> {
        return this.http.get<StudentDashboard>(`${this.apiUrl}/dashboard/student/${studentId}`);
    }
    
  
}
