import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink } from '@angular/router';
import { Cohort } from '../../models/cohort.model';
import { CohortService } from '../../service/cohort.service';
import { FormsModule } from '@angular/forms';
import { TeacherListService } from '../../service/teacher-list';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cohort-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cohort.html',
  styleUrl: './cohort.css',
})
export class CohortList implements OnInit {
  cohorts: Cohort[] = [];
  isLoading = true;
  searchQuery: string = '';
  filteredCohorts: Cohort[] = [];
  teacherMap: Record<string, string> = {};
  

  constructor(
    private cohortService: CohortService,
    private teacherListService: TeacherListService) {}

  ngOnInit(): void {
    this.loadCohorts();
   
  }

  loadCohorts(): void {
    this.isLoading = true;

    forkJoin({
      cohorts: this.cohortService.getAllCohorts(),
      teachers: this.teacherListService.getTeachers()
    }).subscribe({
      next: ({ cohorts, teachers }) => {
        this.cohorts = cohorts;
        this.filteredCohorts = cohorts;

        teachers.forEach(t => {
          this.teacherMap[t.id] = t.username;
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading cohorts or teachers:', err);
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
      (cohort.level || '').toLowerCase().includes(query) ||
      (this.teacherMap[cohort.teacherId] || '').toLowerCase().includes(query)
    );
  }

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
    const remaining = Math.max(0, max - enrolled);
    return `${enrolled}/${max} (${remaining} spots left)`;
  }

  confirmDelete(cohortId?: string): void {
    if (!cohortId) {
      console.error('Cannot delete cohort: missing cohortId');
      return;
    }

    const checkConfirmation = confirm('🛑 WARNING: This will permanently delete this cohort group. Are you absolutely sure?');
    if (checkConfirmation) {
      this.cohortService.deleteCohort(cohortId).subscribe({
        next: () => {
          this.cohorts = this.cohorts.filter(c => c.id !== cohortId);
          this.filteredCohorts = this.filteredCohorts.filter(c => c.id !== cohortId);
        },
        error: (err) => {
          console.error('Error deleting cohort:', err);
        }
      });
    }
  }

  trackCohortById(index: number, cohort: Cohort): string {
    return cohort.id!;
  }
}