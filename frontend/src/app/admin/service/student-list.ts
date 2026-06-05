import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentListService {

  
  
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient){}

  getStudents(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/students`);
  }

  searchUnassignedStudents(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/students/search`, {
      params: { query }
    });
  }


}
