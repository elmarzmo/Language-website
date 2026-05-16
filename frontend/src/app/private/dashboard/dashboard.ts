import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Auth } from '../../services/auth';
import { DashboardService, StudentDashboard, ClassSession } from '../../services/dashboardService';
import { LessonModule } from '../../services/lesson.model';
import { LessonService } from '../../services/lesson';
import { forkJoin } from 'rxjs';

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
  lessons: LessonModule[] = [];
  
  // Loading states
  isLoading = true;
  isLoadingLesson = false;

  lessonLookup: Map<string, LessonModule> = new Map();
  completedLessons: Set<string> = new Set();

  constructor(
    private auth: Auth,
    private dashboardService: DashboardService,
    private router: Router,
    private lessonService: LessonService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
    this.loadData();
    this.updateTime();
  
    },0);
   
    setInterval(() => this.updateTime(), 60000);
  }

  private loadData(): void {
    this.studentId = localStorage.getItem('studentId') || '';
    this.studentName = localStorage.getItem('studentName') || 'Student';

    if (!this.studentId) {
      this.router.navigate(['/signin']);
      return;
    }

    this.isLoading = true;

    forkJoin({
      dashboard: this.dashboardService.getStudentDashboard(),
      allLessons: this.lessonService.getStudentLessons()
    }).subscribe({
      next: (res) => {
        this.dashboardData = res.dashboard;
        this.upcomingClasses = res.dashboard.upcomingClasses;
        this.lessons = res.allLessons;


        this.lessonLookup.clear();
        res.allLessons.forEach(lesson => {
          this.lessonLookup.set(lesson.id, lesson);
        });

        this.completedLessons.clear();
        if (res.dashboard.progressList) {
          res.dashboard.progressList.forEach(p => {
          if (p.completed) {
            this.completedLessons.add(p.lessonModuleId);
          }
         });
        }
        this.isLoading = false;
        console.log('Dashboard fully synced');
      },
      error: (err) => {
        console.error('Failed to sync dashboard data', err);
        this.isLoading = false;
      }
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
    if (classSession.status === 'COMPLETED' || classSession.status === 'CANCELLED') {
      return 'PAST';
    }
  
    const now = new Date();
    const classDate = new Date(classSession.dateTime);

    if (classDate.toDateString() === now.toDateString()) {
      return 'TODAY';
    }
    return 'UPCOMING';
  }

  getLessonInfo(lessonId: string): LessonModule | null {
    return this.lessonLookup.get(lessonId) || null;
  }

 

    isCompleted(lessonId: string): boolean {
      return this.completedLessons.has(lessonId);
    }
    

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/signin']);
  }
}