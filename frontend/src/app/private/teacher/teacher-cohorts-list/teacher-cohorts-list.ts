import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Cohort } from '../../../model/cohort.model';
import { ClassSession } from '../../../model/classSession.model';
import { CohortService } from '../../../services/cohort-service';
import { ClassSessionService } from '../../../services/class-session-service'
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-teacher-cohorts-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './teacher-cohorts-list.html',
  styleUrl: './teacher-cohorts-list.css', 
})
export class TeacherCohortsList implements OnInit {
  cohorts: Cohort[] = [];
  filteredCohorts: Cohort[] = [];
  isLoading = true;
  searchQuery: string = '';
  
  // Track which cohort is currently having its name edited inline
  editingCohortId: string | null = null;
  tempName: string = '';

  // Track session meeting link editing inline using the session ID
  editingSessionId: string | null = null;
  tempMeetingLink: string = '';

  // Replace this with your actual Auth/Session Service logic to get the logged-in teacher's ID
  currentTeacherId: string = 'TEACHER_ID_FROM_AUTH_SERVICE'; 

  constructor(
    private cohortService: CohortService,
    private sessionService: ClassSessionService
  ) {}

  ngOnInit(): void {
    this.loadTeacherDashboardData();
  }

  loadTeacherDashboardData(): void {
    this.isLoading = true;

    forkJoin({
      allCohorts: this.cohortService.getAllCohorts(),
      allSessions: this.sessionService.getSessionsByTeacher(this.currentTeacherId)
    }).subscribe({
      next: ({ allCohorts, allSessions }) => {
        // 1. Filter cohorts assigned to this teacher
        this.cohorts = allCohorts.filter(c => c.teacherId === this.currentTeacherId);

        // 2. Map the closest upcoming/active session to each cohort based on cohortId
        this.cohorts.forEach(cohort => {
          cohort.upcomingSession = allSessions
            .filter(s => s.cohortId === cohort.id && s.status === 'SCHEDULED')
            .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())[0]; // Gets the soonest session
        });

        this.filteredCohorts = [...this.cohorts];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard datasets:', err);
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredCohorts = this.cohorts;
      return;
    }
    this.filteredCohorts = this.cohorts.filter(cohort =>
      (cohort.name || '').toLowerCase().includes(query) ||
      (cohort.level || '').toLowerCase().includes(query)
    );
  }

  // --- Inline Name Editing (Cohort Level) ---

  startEditName(cohort: Cohort): void {
    this.editingCohortId = cohort.id || null;
    this.tempName = cohort.name;
  }

  saveName(cohort: Cohort): void {
    if (!this.tempName.trim() || !cohort.id) return;
    
    this.cohortService.updateCohort(cohort.id, { name: this.tempName }).subscribe({
      next: () => {
        cohort.name = this.tempName;
        this.editingCohortId = null;
      },
      error: (err) => console.error('Failed to update name:', err)
    });
  }

  // --- Inline Meeting Link Editing (ClassSession Level) ---

  startEditMeeting(session: ClassSession): void {
    this.editingSessionId = session.id || null;
    this.tempMeetingLink = session.meetingLink || ''; 
  }

  saveMeetingLink(cohort: Cohort): void {
    const session = cohort.upcomingSession;
    if (!session || !session.id) {
      console.error('No class session instance available to link to.');
      return;
    }

    this.sessionService.updateSession(session.id, { meetingLink: this.tempMeetingLink }).subscribe({
      next: () => {
        session.meetingLink = this.tempMeetingLink;
        this.editingSessionId = null;
      },
      error: (err) => console.error('Failed to update meeting link:', err)
    });
  }

  // --- Helpers ---

  getLevelBadgeColor(level: string): string {
    const colors: { [key: string]: string } = {
      'BEGINNER': 'badge-beginner',
      'INTERMEDIATE': 'badge-intermediate',
      'ADVANCED': 'badge-advanced'
    };
    return colors[level] || 'badge-beginner';
  }

  getStudentStatus(cohort: Cohort): string {
    const enrolled = cohort.studentIds?.length || 0;
    const max = cohort.maxStudents;
    return `${enrolled}/${max} Students`;
  }

  trackCohortById(index: number, cohort: Cohort): string {
    return cohort.id!;
  }
}