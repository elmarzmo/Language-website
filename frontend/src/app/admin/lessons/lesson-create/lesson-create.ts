import { Component } from '@angular/core';
import { LessonModule } from '../../../services/lesson.model';
import { LessonService } from '../../../services/lesson';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lesson-create',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './lesson-create.html',
  styleUrl: './lesson-create.css',
})
export class LessonCreate {
  
  lesson: Partial<LessonModule> = {
    title: '',
    content: '',
    description: '',
    instructions: ''
  };

  constructor(
    private lessonService: LessonService,
    private router: Router
  ) { }

  createLesson() {
    
    if (!this.lesson.title || !this.lesson.description) {
      alert('Please fill in all fields');
      return;
    }
     this.lessonService.createLesson(this.lesson as LessonModule)
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