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
      });
    } else {
      console.error('No lesson ID provided in route');
    }
  }
}
