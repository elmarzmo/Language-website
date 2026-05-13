import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LessonService } from '../../../services/lesson';
import { CommonModule } from '@angular/common';

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

  toggleTextToSpeech() {
    if (!this.isSpeechSupported) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    // Handle resume
    if (this.isPaused) {
      this.synthesis.resume();
      this.isPaused = false;
      return;
    }

    // Handle pause
    if (this.isReading) {
      this.synthesis.pause();
      this.isPaused = true;
      return;
    }

    // Start new speech
    const textToRead = `
    ${this.lesson.title}.
    ${this.stripHtml(this.lesson.content)}
    `.trim();

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = this.playbackRate;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      this.isReading = true;
      this.isPaused = false;
    };

    utterance.onend = () => {
      this.isReading = false;
      this.isPaused = false;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      this.isReading = false;
      this.isPaused = false;
    };

    this.isReading = true;
    this.synthesis.speak(utterance);
  }

  stopTextToSpeech(): void {
    this.synthesis.cancel();
    this.isReading = false;
    this.isPaused = false;
  }

  setPlaybackRate(event: any): void {
    const rate = parseFloat(event.target.value);
    this.playbackRate = rate;

    // If currently playing, we need to restart with new rate
    if (this.isReading && !this.isPaused) {
      const wasReading = this.isReading;
      this.stopTextToSpeech();
      
      // Restart with new rate after a brief delay
      setTimeout(() => {
        if (wasReading) {
          this.toggleTextToSpeech();
        }
      }, 100);
    }
  }

  private stripHtml(html: string): string {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  }

  getReadButtonText(): string {
    if (!this.isSpeechSupported) return '🎧 Not Supported';
    if (this.isPaused) return '▶️ Resume';
    if (this.isReading) return '⏸️ Pause';
    return '🎧 Listen';
  }
}