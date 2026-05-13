import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonService } from '../../../services/lesson';
import { FormsModule } from '@angular/forms';
import { LessonModule } from '../../../services/lesson.model';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-lesson-edit',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './lesson-edit.html',
  styleUrl: './lesson-edit.css',
})
export class LessonEdit implements OnInit {
  lesson!: LessonModule;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private lessonService: LessonService,
    private router: Router
  ) {}


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.lessonService.getLessonsById(id).subscribe({
        next: (data) => {
          this.lesson = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.log("Could not find lesson", err);
          this.router.navigate(['/admin/lessons']);
        }
      });
    }
  }

  onUpdateLesson(): void {
    this.lessonService.updateLesson(this.lesson.id, this.lesson).subscribe({
      next: () => {
        alert('Lesson updated successfuly!');
        this.router.navigate(['/admin/lessons']);
      },
      
      error: (err) => console.error("Update failed", err)
    });
  }


}
