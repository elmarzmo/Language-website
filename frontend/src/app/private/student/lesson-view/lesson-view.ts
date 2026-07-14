import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LessonService } from '../../../services/lesson';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-lesson-view',
  imports: [CommonModule, RouterLink],
  templateUrl: './lesson-view.html',
  styleUrl: './lesson-view.css',
})
export class LessonView implements OnInit {

  lesson: any; 

  audioUrl = '';
  constructor(
    private route: ActivatedRoute,
    private lessonService: LessonService
  ) { }

  ngOnInit(): void {
    const lessonId = this.route.snapshot.paramMap.get('id');


   
    if (lessonId) {
      this.lessonService.getStudentLessons().subscribe((data: any) => {
        this.lesson = data.find((l: any) => l.id === lessonId);


        if (this.lesson?.audioUrl) {  
          
          this.audioUrl = environment.apiUrl.replace(/\/api$/, '') + this.lesson.audioUrl;
          
        }
        // mark after 10 seconds as completed
        setTimeout(() => {
          this.markAsCompleted(lessonId);
        }, 10000);
      });
    } else {
      console.error('No lesson ID provided in route');
    }
  }

  
  markAsCompleted(lessonId: string) {
    this.lessonService.markLessonComplete(lessonId).subscribe({
      next: () => {
        console.log('Lesson marked as completed');
      },
      error: (err) => {
        console.error('Failed to mark lesson as completed', err);
        
      }
    })
  }





}