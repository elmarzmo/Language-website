import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Auth } from '../../../services/auth';
import { DashboardService, StudentDashboard, ClassSession } from '../../../services/dashboardService';
import { LessonModule } from '../../../model/lesson.model';
import { LessonService } from '../../../services/lesson';
import { catchError, forkJoin, of, tap } from 'rxjs';

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
export class Dashboard implements OnInit, OnDestroy {
  studentId: string = '';
  studentName: string = '';
  currentTime: string = '';

  dashboardData!: StudentDashboard;
  upcomingClasses: ClassSession[] = [];
  lessons: LessonModule[] = [];

  isLoading = true;
  isEnrolled = false;       // ← only flipped to true when dashboard API call succeeds
  private dashboardLoaded = false; // internal flag to track API success

  lessonLookup: Map<string, LessonModule> = new Map();
  completedLessons: Set<string> = new Set();

  private timeInterval: any;

  constructor(
    private auth: Auth,
    private dashboardService: DashboardService,
    private router: Router,
    private lessonService: LessonService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.updateTime();
    this.timeInterval = setInterval(() => this.updateTime(), 60000);
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  private loadData(): void {
    this.auth.getCurrentUser().subscribe({
      next: (user: any) => {
        this.studentId = user.id;
        this.studentName = user.username;
        this.isLoading = true;

        forkJoin({
          dashboard: this.dashboardService.getStudentDashboard().pipe(
            tap(() => { this.dashboardLoaded = true; }), // ← only runs on API success
            catchError(err => {
              console.warn('Dashboard load failed (student likely not in cohort):', err?.error?.message || err);
              this.dashboardLoaded = false;
              return of({ upcomingClasses: [], progressList: [] } as unknown as StudentDashboard);
            })
          ),
          allLessons: this.lessonService.getStudentLessons().pipe(
            catchError(err => {
              console.error('Error loading lessons:', err);
              return of([] as LessonModule[]);
            })
          )
        }).subscribe({
          next: (res) => {
            this.dashboardData = res.dashboard;
           
            const now = Date.now();
            this.upcomingClasses = (res.dashboard.upcomingClasses ?? [])
            .filter(c => {
              const end =
              new Date(c.dateTime).getTime() +
              c.durationMinutes * 60 * 1000;
              return end >= now;
            })
            .sort((a, b) =>
              new Date(a.dateTime).getTime() -
              new Date(b.dateTime).getTime()
            )

            this.lessons = res.allLessons;



            // isEnrolled is ONLY true when the dashboard API actually succeeded
            this.isEnrolled = this.dashboardLoaded;

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
            console.log('Dashboard fully synced — enrolled:', this.isEnrolled);
          },
          error: (err) => {
            console.error('Failed to sync dashboard data', err);
            this.isEnrolled = false;
            this.isLoading = false;
          }
        });
      },
      error: () => {
        this.router.navigate(['/signin']);
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