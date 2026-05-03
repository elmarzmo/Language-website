import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Auth } from '../../services/auth';
import { DashboardService, StudentDashboard, ClassSession, StudentProgress } from '../../services/dashboardService';
import { LessonModule } from '../../services/lesson.model';
import { LessonService } from '../../services/lesson';


@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  host: {
    'class': 'dashboard-host',
    'style': 'display: block; height: 100%; width: 100%;'
  }
})
export class Dashboard implements OnInit {
  studentId: string = '';
  studentName: string = '';
  currentTime: string = '';
  
 dashboardData!: StudentDashboard;

upcomingClasses: ClassSession[] = [];
progressList: StudentProgress[] = [];

lessons: LessonModule[] = [];

  
  // Loading states
  isLoading = true;
  isLoadingLesson = false;

  constructor(
    private auth: Auth,
    private dashboardService: DashboardService,
    private router: Router,
    private lessonService: LessonService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.updateTime();
    setInterval(() => this.updateTime(), 60000);
  }

  private loadData(): void {
    // Get student ID from auth service or local storage
    this.studentId = localStorage.getItem('studentId') || '';
    this.studentName = localStorage.getItem('studentName') || 'Student';

    if (!this.studentId) {
      this.router.navigate(['/signin']);
      return;
    }

    // Load lessons and upcoming classes
    this.dashboardService.getStudentDashboard(this.studentId).subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.upcomingClasses = data.upcomingClasses;
        this.progressList = data.progressList;

        this.isLoading = false;

        console.log('Dashboard data loaded:', this.dashboardData);
      },
      error: (err) => {
        console.error('Failed to load lessons:', err);
        this.isLoading = false;
      }
    });

    // lessons (separate)
  this.lessonService.getAllLessons().subscribe({
    next: (lessonsData) => {
      this.lessons = lessonsData;
    },
    error: (err) => console.error('Could not load lessons', err)
  });

   
    
  }

  private updateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }



  joinClass(classSession: ClassSession): void {
    if (classSession.meetingLink) {
      window.open(classSession.meetingLink, '_blank');
    } else {
      alert('Meeting link not available for this class.');
    }
  }

  

  getResourceIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'pdf': '📄',
      'video': '🎥',
      'exercise': '✏️',
      'reading': '📖',
      'link': '🔗'
    };
    return icons[type] || '📎';
  }

  getClassStatus(classSession: ClassSession): string {
    const now = new Date();
    const classDate = new Date(classSession.dateTime);

    if (classDate.toDateString() === now.toDateString()) {
      return 'TODAY';
    } else if (classDate > now) {
      return 'UPCOMING';
    }
    return 'PAST';
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/signin']);
  }
}