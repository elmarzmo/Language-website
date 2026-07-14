import { Component } from '@angular/core';
import { LessonModule } from '../../../model/lesson.model';
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

  audioFile?: File;

  lesson: Partial<LessonModule> = {
    title: '',
    content: '',
    description: '',
    instructions: '',
    notes: '',
  };


  constructor(
    private lessonService: LessonService,
    private router: Router
  ) { }


  onAudioSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.audioFile = file;
    }
  }


  createLesson() {

    if (!this.lesson.title || !this.lesson.description) {
      alert('Please fill in all fields');
      return;
    }


    const formData = new FormData();


    formData.append(
      'lesson',
      new Blob(
        [JSON.stringify(this.lesson)],
        { type: 'application/json' }
      )
    );

console.log(this.audioFile);
    if (this.audioFile) {
      formData.append(
        'audio',
        this.audioFile
      );
    }


    this.lessonService.createLesson(formData)
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