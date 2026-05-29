import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LessonService } from '../../services/lesson';

@Component({
  selector: 'app-teacher-lessons-view',
  imports: [],
  templateUrl: './teacher-lessons-view.html',
  styleUrl: './teacher-lessons-view.css',
})
export class TeacherLessonsView {
  
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
   

   
    if (lessonId) {
      this.lessonService.getStudentLessons().subscribe((data: any) => {
        this.lesson = data.find((l: any) => l.id === lessonId);

        // mark after 10 seconds as completed
        setTimeout(() => {
         
        }, 10000);
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

}
