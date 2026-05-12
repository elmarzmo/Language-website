import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LessonModule } from '../../../services/lesson.model';
import { LessonService } from '../../../services/lesson';

@Component({
  selector: 'app-lesson-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './lesson-list.html',
  styleUrl: './lesson-list.css',
})
export class LessonList implements OnInit {

  lessons: LessonModule[] = [];
  isLoading = true;

  constructor(private lessonService: LessonService) { }

  ngOnInit(): void {
    this.loadLessons();
  }

  loadLessons() {
    this.isLoading = true;
    this.lessonService.getAllLessons().subscribe({
      next: (data) => {
        this.lessons = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading lessons', err);
        this.isLoading = false;
      }
    });
  }

onDeleteLesson(id: string): void {
    if (confirm('Are you sure you want to delete this lesson?')) {
      this.lessonService.deleteLesson(id).subscribe({
        next: () => {
          // Remove the lesson from the local array so the UI updates immediately
          this.lessons = this.lessons.filter(l => l.id !== id);
          console.log('Lesson deleted successfully');
        },
        error: (err: Error) => {
        console.error('Error deleting lesson :', err);
       
      }
      });
    }
  }
}
