import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { Cohort } from '../../../model/cohort.model';
import { ClassSession } from '../../../model/classSession.model';

import { CohortService } from '../../../services/cohort-service';
import { ClassSessionService } from '../../../services/class-session-service';
import { Auth } from '../../../guards/auth';

@Component({
  selector: 'app-teacher-cohorts-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-cohorts-list.html',
  styleUrls: ['./teacher-cohorts-list.css']
})
export class TeacherCohortsList implements OnInit {

  cohorts: Cohort[] = [];
  filteredCohorts: Cohort[] = [];

  isLoading = true;
  searchQuery = '';

  teacherId = '';
  teacherName = '';

  editingCohortId: string | null = null;
  tempName = '';

  editingSessionId: string | null = null;
  tempMeetingLink = '';

  constructor(
    private auth: Auth,
    private cohortService: CohortService,
    private sessionService: ClassSessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTeacherProfile();
  }

  private loadTeacherProfile(): void {
    this.auth.getCurrentUser().subscribe({
      next: (user: any) => {
        this.teacherId = user.id;
        this.teacherName = user.username;

        this.loadTeacherDashboardData();
      },
      error: () => {
        this.router.navigate(['/signin']);
      }
    });
  }

  private loadTeacherDashboardData(): void {
    this.isLoading = true;

    forkJoin({
      allCohorts: this.cohortService.getAllCohorts(),
      allSessions: this.sessionService.getSessionsByTeacher(this.teacherId)
    }).subscribe({
      next: ({ allCohorts, allSessions }) => {

        this.cohorts = allCohorts.filter(
          cohort => cohort.teacherId === this.teacherId
        );

        this.cohorts.forEach(cohort => {

          cohort.upcomingSession = allSessions
            .filter(session =>
              session.cohortId === cohort.id &&
              session.status === 'SCHEDULED'
            )
            .sort(
              (a, b) =>
                new Date(a.dateTime).getTime() -
                new Date(b.dateTime).getTime()
            )[0];

        });

        this.filteredCohorts = [...this.cohorts];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load teacher cohorts:', err);
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    const query = this.searchQuery.toLowerCase().trim();

    if (!query) {
      this.filteredCohorts = [...this.cohorts];
      return;
    }

    this.filteredCohorts = this.cohorts.filter(cohort =>
      (cohort.name || '').toLowerCase().includes(query) ||
      (cohort.level || '').toLowerCase().includes(query)
    );
  }

  startEditName(cohort: Cohort): void {
    this.editingCohortId = cohort.id ?? null;
    this.tempName = cohort.name;
  }

  saveName(cohort: Cohort): void {

    if (!cohort.id || !this.tempName.trim()) {
      return;
    }

    this.cohortService.updateCohort(
      cohort.id,
      { name: this.tempName }
    ).subscribe({
      next: () => {
        cohort.name = this.tempName;
        this.editingCohortId = null;
      },
      error: err => {
        console.error('Failed to update cohort name:', err);
      }
    });
  }

  startEditMeeting(session: ClassSession): void {
    this.editingSessionId = session.id ?? null;
    this.tempMeetingLink = session.meetingLink || '';
  }

  saveMeetingLink(cohort: Cohort): void {

    const session = cohort.upcomingSession;

    if (!session?.id) {
      return;
    }

    this.sessionService.updateSession(
      session.id,
      {
        meetingLink: this.tempMeetingLink
      }
    ).subscribe({
      next: () => {
        session.meetingLink = this.tempMeetingLink;
        this.editingSessionId = null;
      },
      error: err => {
        console.error('Failed to update meeting link:', err);
      }
    });
  }

  getLevelBadgeColor(level: string): string {
    const colors: Record<string, string> = {
      BEGINNER: 'badge-beginner',
      INTERMEDIATE: 'badge-intermediate',
      ADVANCED: 'badge-advanced'
    };

    return colors[level] || 'badge-beginner';
  }

  getStudentStatus(cohort: Cohort): string {
    const enrolled = cohort.studentIds?.length || 0;
    return `${enrolled}/${cohort.maxStudents} Students`;
  }

  trackCohortById(index: number, cohort: Cohort): string {
    return cohort.id ?? index.toString();
  }
}