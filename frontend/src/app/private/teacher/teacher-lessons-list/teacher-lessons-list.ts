import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherDashboardService } from '../../../services/teacher-dashboard.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-teacher-lessons-list',
  standalone: true,
  imports: [ CommonModule, RouterLink ],
  templateUrl: './teacher-lessons-list.html',
  styleUrl: './teacher-lessons-list.css' // Create an empty CSS file for this if needed
})
export class TeacherLessonsList implements OnInit {
  lessons: any[] = [];
  isLoading: boolean = true;

  constructor(private teacherDashboardService: TeacherDashboardService) {}

  ngOnInit(): void {
    this.teacherDashboardService.getTeacherLessons().subscribe({
      next: (data: any) => {
        this.lessons = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading resources:', err);
        this.isLoading = false;
      }
    });
  }
}