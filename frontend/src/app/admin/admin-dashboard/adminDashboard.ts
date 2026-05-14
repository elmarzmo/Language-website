import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Auth } from '../../services/auth';
import { LessonModule } from '../../services/lesson.model';
import { LessonService } from '../../services/lesson';
import { forkJoin, Subscription } from 'rxjs';
import { AdminDashboardService } from '../service/admin-dashboard-service';
import { ClassSession } from '../models/class-session.model';
import { User } from '../models/user.model';
import { StudentListService } from '../service/student-list';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './admindashboard.html',
  styleUrls: ['./admindashboard.css'],
  host: {
    'class': 'dashboard-host',
    'style': 'display: block; height: 100%; width: 100%;'
  }
})
export class AdminDashboard implements OnInit, OnDestroy {
  adminName: string = '';
  currentTime: string = '';
  
  allClasses: ClassSession[] = [];
  lessons: LessonModule[] = [];
  allStudents: User[] = [];
  
  isLoading = true;
  private timeInterval: any;

  constructor(
    private auth: Auth,
    private admindashboardService: AdminDashboardService,
    private lessonService: LessonService,
    private studentService: StudentListService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setAdminInfo();
    this.loadManagementData();
    this.updateTime();
    
    // Update clock every minute
    this.timeInterval = setInterval(() => this.updateTime(), 60000);
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  private setAdminInfo(): void {
    // Using 'adminName' or 'studentName' depending on how you store it in localStorage
    this.adminName = localStorage.getItem('studentName') || 'Administrator';
    const adminId = localStorage.getItem('studentId');

    if (!adminId) {
      this.router.navigate(['/signin']);
    }
  }

  private loadManagementData(): void {
    this.isLoading = true;

    forkJoin({
      dashboard: this.admindashboardService.getAdminDashboard(), // Keeping service call as is
      allLessons: this.lessonService.getAllLessons(),
      allStudents: this.studentService.getStudents()
    }).subscribe({
      next: (res) => {
        this.allClasses = res.dashboard.allClasses;
        this.lessons = res.allLessons;
        this.allStudents = res.allStudents;
        this.isLoading = false;
        console.log('Admin Dashboard synced successfully');
      },
      error: (err) => {
        console.error('Failed to sync admin data', err);
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

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/signin']);
  }
}