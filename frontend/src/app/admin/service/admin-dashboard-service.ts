import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs'
import { environment } from '../../../environments/environment';
import { AdminDashboard } from '../models/admin-dashboard.model';

/*

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
*/

@Injectable({
  providedIn: 'root',
})

export class AdminDashboardService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getAdminDashboard(): Observable<AdminDashboard> {
        return this.http.get<AdminDashboard>(`${this.apiUrl}/admin`)
        .pipe(
          map(data => {
           
            if(data.allClasses && data.allClasses.length > 0){
            data.allClasses.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
            }
            return data;
          }
          )
        );
    }
    
    
  
}

