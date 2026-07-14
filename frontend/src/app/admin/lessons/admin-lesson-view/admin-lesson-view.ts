import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LessonService } from '../../../services/lesson';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-lesson-view',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-lesson-view.html',
  styleUrl: './admin-lesson-view.css',
})
export class AdminLessonView implements OnInit, OnDestroy {

  lesson: any; 
  isReading: boolean = false;
  isSpeechSupported: boolean = false;
  isPaused: boolean = false;
  playbackRate: number = 1;
  private synthesis = window.speechSynthesis;
  audioUrl = '';
  
  constructor(
    private route: ActivatedRoute,
    private lessonService: LessonService
  ) { }

  ngOnInit(): void {
  const lessonId = this.route.snapshot.paramMap.get('id');
  this.isSpeechSupported = 'speechSynthesis' in window;

  if (lessonId) {
    // 1. Use the specific ID fetcher (faster)
    // 2. Use the Admin-level service (so you can see Drafts too)
    this.lessonService.getLessonsById(lessonId).subscribe({
      next: (data) => {
        this.lesson = data;

        if (this.lesson?.audioUrl) {
          const backendUrl = environment.apiUrl.replace(/\/api$/, '');
          this.audioUrl = backendUrl + this.lesson.audioUrl;
        }
        
        
      },
      error: (err) => {
        console.error('Could not load lesson. Is it deleted?', err);
      }
    });
  }
}

  ngOnDestroy(): void {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
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