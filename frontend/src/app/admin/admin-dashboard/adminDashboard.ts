import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Auth } from '../../guards/auth';
import { LessonModule } from '../../model/lesson.model';
import { LessonService } from '../../services/lesson';
import { forkJoin, Subscription } from 'rxjs';
import { AdminDashboardService } from '../service/admin-dashboard-service';
import { ClassSession } from '../models/class-session.model';
import { User } from '../models/user.model';
import { StudentListService } from '../service/student-list';
import { Cohort } from '../models/cohort.model'
import { CohortService } from '../service/cohort.service';


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
  adminId: string = '';
  currentTime: string = '';
  
  allClasses: ClassSession[] = [];
  lessons: LessonModule[] = [];
  allStudents: User[] = [];
  allCohorts: Cohort[] = [];
   
  isLoading = true;
  private timeInterval: any;

  constructor(
    private auth: Auth,
    private admindashboardService: AdminDashboardService,
    private lessonService: LessonService,
    private studentService: StudentListService,
    private cohortSerivece: CohortService,
    private router: Router
  ) {}

  ngOnInit(): void {
  
    this.loadAdminData();
    this.updateTime();
    
    // Update clock every minute
    this.timeInterval = setInterval(() => this.updateTime(), 60000);
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  private loadAdminData(): void {
    // To do : change this to get student Id from JWT/session

     this.auth.getCurrentUser().subscribe({
      next: (user: any) => {
        this.adminId = user.id;
        this.adminName = user.username;

        this.loadManagementData();
       
      },
      error: () => {
        this.router.navigate(['/signin']);
      }
    })
    

  }

  private loadManagementData(): void {

    this.isLoading = true;

    forkJoin({
      dashboard: this.admindashboardService.getAdminDashboard(), // Keeping service call as is
      allLessons: this.lessonService.getAllLessons(),
      allStudents: this.studentService.getStudents(),
      allCohorts: this.cohortSerivece.getAllCohorts(),
    }).subscribe({
      next: (res) => {
        this.allClasses = res.dashboard.allClasses;
        this.lessons = res.allLessons;
        this.allStudents = res.allStudents;
        this.allCohorts = res.allCohorts;
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