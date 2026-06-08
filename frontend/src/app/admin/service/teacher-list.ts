import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeacherListService {

  
  
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient){}

  getTeachers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/teachers`);
  }

  searchUnassignedTeachers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/teachers/search`, {
      params: { query }
    });
  }


}
