import { Component, OnInit } from '@angular/core';
import { ClassSession } from '../../service/class-session';
import { LessonService } from '../../../services/lesson';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-class-create',
  imports: [CommonModule, FormsModule],
  templateUrl: './class-create.html',
  styleUrl: './class-create.css',
})
export class ClassCreate implements OnInit {
  
  lessons: any[] = [];

  classSession = {
    lessonModuleId: '',
    teacherId: '',
    studentIds: [],
    dateTime: '',
    meetingLink: '',
    status: 'Scheduled',
  };

  constructor(
    private classSessionService: ClassSession,
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
    this.classSessionService.createClassSession(this.classSession).subscribe(() => {
      this.route.navigate(['/admin/class-sessions']);
    });
  }





}
