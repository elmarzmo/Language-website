import { Component } from '@angular/core';
import { LessonModule } from '../../../services/lesson.model';
import { LessonService } from '../../../services/lesson';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lesson-create',
  imports: [FormsModule, CommonModule],
  templateUrl: './lesson-create.html',
  styleUrl: './lesson-create.css',
})
export class LessonCreate {
  
  lesson: Partial<LessonModule> = {
    title: '',
    content: '',
    description: ''
  };

  constructor(
    private lessonService: LessonService,
    private router: Router
  ) { }

  createLesson() {
    const role = localStorage.getItem('role' ) || '';
    if (!this.lesson.title || !this.lesson.description) {
      alert('Please fill in all fields');
      return;
    }
     this.lessonService.createLesson(this.lesson as LessonModule, role)
      .subscribe({
        next: () => {
          console.log('Lesson created successfully');
          this.router.navigate(['/admin/lessons']);
        },
        error: (err) => {
          console.error('Error creating lesson', err);
        }
      });
  }

}
