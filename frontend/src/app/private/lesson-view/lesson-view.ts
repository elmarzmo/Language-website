import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LessonService } from '../../services/lesson';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lesson-view',
  imports: [CommonModule, RouterLink],
  templateUrl: './lesson-view.html',
  styleUrl: './lesson-view.css',
})
export class LessonView implements OnInit, OnDestroy {

  lesson: any; 
  isReading: boolean = false;
  isSpeechSupported: boolean = false;
  private synthesis= window.speechSynthesis;
  constructor(
    private route: ActivatedRoute,
    private lessonService: LessonService
  ) { }

  ngOnInit(): void {
    const lessonId = this.route.snapshot.paramMap.get('id');
    this.isSpeechSupported = 'speechSynthesis' in window;

   
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
    if (this.synthesis.speaking || this.synthesis.paused) {
      if (this.synthesis.paused) {
        this.synthesis.resume();
      } else {
        this.synthesis.pause();
      }
      return;
    }
    
    const textToRead = `
    ${this.lesson.title}.
    ${this.lesson.description}.
    ${this.stripHtml(this.lesson.content)}
    `.trim();


    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      this.isReading = true;
    };

    utterance.onend = () => {
      this.isReading = false;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      this.isReading = false;
    };

    this.synthesis.speak(utterance);

  }

  stopTextToSpeech(): void {
    this.synthesis.cancel();
    this.isReading = false;
  }

  private stripHtml(html: string): string {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  }

  getReadButtonText(): string {
    if (!this.isSpeechSupported) return '🎧 Not Supported';
    if (this.synthesis.paused) return '▶️ Resume';
    if (this.isReading) return '⏸️ Pause';
    return '🎧 Listen to Lesson';
  }
}
