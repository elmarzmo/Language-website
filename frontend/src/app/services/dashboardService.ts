import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';


export interface ClassSession {
  id: string;
  teacherId: string;
  studentIds: string[];
  lessonModuleId: string;
  dateTime: string; // ISO format
  durationMinutes: number; // in minutes
  meetingLink: string;
  status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
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
        return this.http.get<StudentDashboard>(`${this.apiUrl}/dashboard/student/${studentId}`)
        .pipe(
          map(data => {
            // sort classes the nearst first
            data.upcomingClasses.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
            return data;
          }
          )
        );
    }
    
  
}
