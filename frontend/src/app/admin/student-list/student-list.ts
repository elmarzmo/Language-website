import { Component, OnInit } from '@angular/core';
import { StudentListService } from '../service/student-list';
import { User } from '../models/user.model';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-student-list',
  imports: [ CommonModule,RouterLink, FormsModule],
  templateUrl: './student-list.html',
  styleUrls: ['./student-list.css']
})
export class StudentList implements OnInit {
  allStudents: User[] = [];
  filteredStudents: User[] = [];
  searchQuery: string = '';
  loading: boolean = true;

  constructor(private studentListService: StudentListService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.studentListService.getStudents().subscribe({
      next: (data) => {
        this.allStudents = data;
        this.filteredStudents = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching students:', err);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredStudents = this.allStudents;
      return;
    }

    this.filteredStudents = this.allStudents.filter(student => 
      student.username.toLowerCase().includes(query) || 
      student.email.toLowerCase().includes(query)
    );
  }
}