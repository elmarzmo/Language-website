import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LessonService } from '../../services/lesson';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lesson-view',
  imports: [CommonModule, RouterLink],
  templateUrl: './lesson-view.html',
  styleUrl: './lesson-view.css',
})
export class LessonView implements OnInit {

  lesson: any; 
  constructor(
    private route: ActivatedRoute,
    private lessonService: LessonService
  ) { }

  ngOnInit(): void {
    const lessonId = this.route.snapshot.paramMap.get('id');
   
    if (lessonId) {
      this.lessonService.getAllLessons().subscribe((data: any) => {
        this.lesson = data.find((l: any) => l.id === lessonId);

        // mark after 10 seconds as completed
        setTimeout(() => {
          this.markAsCompleted(lessonId);
        }, 10000);
        this.markAsCompleted(lessonId);
      });
    } else {
      console.error('No lesson ID provided in route');
    }


  }

  markAsCompleted(lessonId: string) {
    const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '[]');  
    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
      localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
    }
  }
}
