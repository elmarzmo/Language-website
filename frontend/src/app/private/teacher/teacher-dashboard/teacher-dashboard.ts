import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

// Services
import { Auth } from '../../../services/auth';
import { LessonService } from '../../../services/lesson';
import { TeacherDashboardService } from '../../../services/teacher-dashboard.service';

// Models
import { ClassSession } from "../../../services/dashboardService";
import { LessonModule } from '../../../model/lesson.model';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './teacher-dashboard.html',
  styleUrls: ['./teacher-dashboard.css'],
  host: {
    'class': 'dashboard-host',
    'style': 'display: block; height: 100%; width: 100%;'
  }
})
export class TeacherDashboard implements OnInit, OnDestroy {
  teacherName: string = '';
  currentTime: string = '';
  isLoading = true;

  // State variables synchronized directly with your TeacherDashboardDTO
  upcomingClasses: ClassSession[] = [];
  cohortCount: number = 0;
  studentCount: number = 0;
  
  // Local cache lookup array for mapping titles via ID 
  lessons: LessonModule[] = [];

  private timeInterval: any;

  constructor(
    private auth: Auth,
    private teacherDashboardService: TeacherDashboardService,
    private lessonService: LessonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTeacherProfile();
    this.updateTime();
    
    // Smooth real-time digital clock update interval ticker
    this.timeInterval = setInterval(() => this.updateTime(), 60000);
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  /**
   * Validates user identity and handles routing fallbacks
   */
  private loadTeacherProfile(): void {
    this.auth.getCurrentUser().subscribe({
      next: (user: any) => {
        this.teacherName = user.username;
        this.loadTeacherWorkspaceData();
      },
      error: () => {
        this.router.navigate(['/signin']);
      }
    });
  }

  /**
   * Parallel API pipeline synchronizing layout metrics and resources
   */
  private loadTeacherWorkspaceData(): void {
    this.isLoading = true;

    forkJoin({
      dashboardData: this.teacherDashboardService.getTeacherDashboard(),
      allLessons: this.teacherDashboardService.getTeacherLessons()
    }).subscribe({
      next: (res) => {
        // Safe mappings from your Spring Boot model metrics response package
        this.upcomingClasses = res.dashboardData.upcomingClasses || [];
        this.cohortCount = res.dashboardData.cohortCount || 0;
        this.studentCount = res.dashboardData.studentCount || 0;
        
        // Cache lesson structures to render titles cleanly using getLessonInfo() lookup
        this.lessons = res.allLessons || [];
        
        this.isLoading = false;
        console.log('Teacher Dashboard components synchronized with Java API.');
      },
      error: (err) => {
        console.error('Failed to resolve sync pipeline for data models:', err);
        this.isLoading = false;
      }
    });
  }

  /**
   * Evaluates current localized windows for live streams or video conference launches
   */
  getClassStatus(session: ClassSession): 'LIVE' | 'UPCOMING' | 'PAST' {
    const start = new Date(session.dateTime).getTime();
    const end = start + (session.durationMinutes * 60 * 1000);
    const now = Date.now();

    if (now >= start && now <= end) {
      return 'LIVE';
    } else if (now < start) {
      return 'UPCOMING';
    } else {
      return 'PAST';
    }
  }

  /**
   * Helper utility matching active IDs to descriptive text metadata objects
   */
  getLessonInfo(lessonModuleId: string): LessonModule | undefined {
    return this.lessons.find(lesson => lesson.id === lessonModuleId);
  }

  /**
   * Launches remote session workspaces safely in a sandboxed tab
   */
  joinClass(session: ClassSession): void {
    if (session.meetingLink) {
      window.open(session.meetingLink, '_blank');
    } else {
      console.warn(`No meeting link assigned yet for class session context reference ID: ${session.id}`);
    }
  }

  /**
   * Formats real-time text layouts
   */
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

  /**
   * Purges local authentication records and clears current view state
   */
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/signin']);
  }
}