import { Component, OnInit } from '@angular/core';
import { ClassSessionService } from '../../service/class-session';
import { LessonService } from '../../../services/lesson';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClassSession } from '../../models/class-session.model';


@Component({
  selector: 'app-class-create',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './class-create.html',
  styleUrl: './class-create.css',
})
export class ClassCreate implements OnInit {
  
  lessons: any[] = [];

  classSession : ClassSession = {
    lessonModuleId: '',
    teacherId: '',
    studentIds: [],
    dateTime: '',
    meetingLink: '',
    status: 'Scheduled',
  };

  studentsInput: string = '';

  constructor(
    private classSessionService: ClassSessionService,
    private lessonService: LessonService,
    private route: Router

  ) {}

  ngOnInit(): void {
    this.loadLessons();

  }

  loadLessons() {
    this.lessonService.getAllLessons().subscribe((data: any) => {
      this.lessons = data;
    });


  }
createClassSession() {
  // Create a copy of the object so we don't break the UI binding
  const payload = { ...this.classSession };

  // If studentIds is a string (from a text input), split it into an array
  if (typeof payload.studentIds === 'string') {
    payload.studentIds = (payload.studentIds as string)
      .split(',')
      .map(id => id.trim()) // Remove extra spaces
      .filter(id => id !== ''); // Remove empty values
  }

  this.classSessionService.createClassSession(payload).subscribe({
    next: () => {
      this.route.navigate(['/admin/classes']);
    },
    error: (err) => {
      console.error("Backend validation failed:", err);
    }
  });
}





}
