import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Cohort } from '../../models/cohort.model';
import { CohortService } from '../../service/cohort.service';
import { FormsModule } from '@angular/forms';

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

  constructor(private cohortService: CohortService) {}

  ngOnInit(): void {
    this.loadCohorts();
  }

  loadCohorts(): void {
    this.isLoading = true;
    this.cohortService.getAllCohorts().subscribe({
      next: (data) => {
        this.cohorts = data;
        this.filteredCohorts = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading cohorts:', err);
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
      cohort.name.toLowerCase().includes(query) ||
      cohort.level.toLowerCase().includes(query) ||
      cohort.teacherId.toLowerCase().includes(query)
    );
  }

  getLevelBadgeColor(level: string): string {
    const colors: { [key: string]: string } = {
      'BEGINNER': 'badge-beginner',
      'INTERMEDITATE': 'badge-intermediate',
      'ADVANCED': 'badge-advanced'
    };
    return colors[level] || 'badge-beginner';
  }

  getStudentStatus(cohort: Cohort): string {
    const enrolled = cohort.studentIds?.length || 0;
    const max = cohort.maxStudents;
    const remaining = max - enrolled;
    return `${enrolled}/${max} (${remaining} spots left)`;
  }
}