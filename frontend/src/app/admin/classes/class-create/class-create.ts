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
    status: 'SCHEDULED',
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
  const payload: ClassSession = {
    ...this.classSession,
    studentIds: this.studentsInput
      .split(',')
      .map(id => id.trim())
      .filter(id => id !== '')
  };

  console.log('PAYLOAD:', payload); //  this for debugging

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
