import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Auth } from '../../services/auth';
import { LessonService } from '../../services/lesson';
import { LessonModule, LiveClass } from '../../services/lesson.model';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule],
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
  
  // Data from backend
  lessons: LessonModule[] = [];
  upcomingClasses: LiveClass[] = [];
  selectedLesson: LessonModule | null = null;
  
  // Loading states
  isLoading = true;
  isLoadingLesson = false;

  constructor(
    private auth: Auth,
    private lessonService: LessonService,
    private router: Router
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
    this.lessonService.getStudentLessons(this.studentId).subscribe({
      next: (lessons) => {
        this.lessons = lessons.sort((a, b) => 
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        );
        this.isLoading = false;
        
        // Auto-select first lesson
        if (this.lessons.length > 0) {
          this.selectLesson(this.lessons[0]);
        }
      },
      error: (err) => {
        console.error('Failed to load lessons:', err);
        this.isLoading = false;
      }
    });

    // Load upcoming classes
    this.lessonService.getUpcomingClasses(this.studentId).subscribe({
      next: (classes) => {
        this.upcomingClasses = classes;
      },
      error: (err) => {
        console.error('Failed to load classes:', err);
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

  selectLesson(lesson: LessonModule): void {
    this.selectedLesson = lesson;
  }

  joinClass(liveClass: LiveClass): void {
    this.lessonService.joinClass(liveClass.id).subscribe({
      next: (response) => {
        window.open(response.meetingLink, '_blank');
      },
      error: (err) => {
        console.error('Failed to join class:', err);
      }
    });
  }

  openResource(lessonId: string, resourceId: string): void {
    // Mark as viewed
    this.lessonService.markResourceViewed(this.studentId, lessonId, resourceId).subscribe({
      next: () => {
        // Find and open the resource
        const lesson = this.lessons.find(l => l.id === lessonId);
        if (lesson) {
          const resource = lesson.resources.find(r => r.id === resourceId);
          if (resource) {
            window.open(resource.url, '_blank');
          }
        }
      },
      error: (err) => {
        console.error('Failed to mark resource as viewed:', err);
      }
    });
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

  getClassStatus(liveClass: LiveClass): string {
    const now = new Date();
    const classDate = new Date(liveClass.scheduledDate);
    
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