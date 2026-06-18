import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Cohort } from '../../../model/cohort.model';
import { CohortService } from '../../../services/cohort-service';
import { FormsModule } from '@angular/forms';

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

  // Track meeting link editing inline
  editingMeetingId: string | null = null;
  tempMeetingLink: string = '';

  // Replace this with your actual Auth/Session Service logic to get the logged-in teacher's ID
  currentTeacherId: string = 'TEACHER_ID_FROM_AUTH_SERVICE'; 

  constructor(private cohortService: CohortService) {}

  ngOnInit(): void {
    this.loadTeacherCohorts();
  }

  loadTeacherCohorts(): void {
    this.isLoading = true;
    this.cohortService.getAllCohorts().subscribe({
      next: (allCohorts) => {
        // Filter cohorts so the teacher only sees their assigned classes
        this.cohorts = allCohorts.filter(c => c.teacherId === this.currentTeacherId);
        this.filteredCohorts = [...this.cohorts];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading teacher cohorts:', err);
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

  // --- Inline Editing Operations ---

  startEditName(cohort: Cohort): void {
    this.editingCohortId = cohort.id || null;
    this.tempName = cohort.name;
  }

  saveName(cohort: Cohort): void {
    if (!this.tempName.trim()) return;
    
    const updatedCohort = { ...cohort, name: this.tempName };
    this.cohortService.updateCohort(updatedCohort).subscribe({
      next: () => {
        cohort.name = this.tempName;
        this.editingCohortId = null;
      },
      error: (err) => console.error('Failed to update name', err)
    });
  }

  startEditMeeting(cohort: Cohort): void {
    this.editingMeetingId = cohort.id || null;
    this.tempMeetingLink = cohort.meetingLink || ''; // Assumes meetingLink exists on your Cohort model
  }

  saveMeetingLink(cohort: Cohort): void {
    const updatedCohort = { ...cohort, meetingLink: this.tempMeetingLink };
    this.cohortService.updateCohort(updatedCohort).subscribe({
      next: () => {
        cohort.meetingLink = this.tempMeetingLink;
        this.editingMeetingId = null;
      },
      error: (err) => console.error('Failed to update meeting link', err)
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