import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TeacherDashboardService } from '../../../services/teacher-dashboard.service';

@Component({
  selector: 'app-teacher-lessons-view',
  imports: [RouterLink, CommonModule],
  templateUrl: './teacher-lessons-view.html',
  styleUrl: './teacher-lessons-view.css',
})
export class TeacherLessonsView implements OnInit {
  
  lesson: any; 
  
  constructor(
    private route: ActivatedRoute,
    private teacherDashboardService: TeacherDashboardService
  ) { }

  ngOnInit(): void {
    const lessonId = this.route.snapshot.paramMap.get('id');
   
    if (lessonId) {
      this.teacherDashboardService.getTeacherLessons().subscribe((data: any) => {
        // Find the specific lesson by making sure both IDs are evaluated as strings
        this.lesson = data.find((l: any) => String(l.id) === String(lessonId));

        if (!this.lesson) {
          console.error(`Lesson with ID ${lessonId} could not be found in the dataset.`);
        }

        // mark after 10 seconds as completed
        setTimeout(() => {
          // Completion logic here
        }, 10000);
      });
    } else {
      console.error('No lesson ID provided in route');
    }
  }
}