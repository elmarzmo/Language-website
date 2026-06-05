import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, catchError, distinctUntilChanged, of } from 'rxjs';
import { CohortService } from '../../service/cohort.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { StudentListService } from '../../service/student-list';

@Component({
  selector: 'app-edit-cohort',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './edit-cohort.html',
  styleUrl: './edit-cohort.css',
})
export class EditCohort implements OnInit, OnDestroy {

  cohortId: string = '';
  cohortName: string = '';
  enrolledStudents: any[] = [];

  isLoading = true;
  isSaving = false;
  showDropdown = false;

  searchQuery: string = '';
  searchResults: any[] = [];
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private cohortService: CohortService,
    private router: Router,
    private studentListService: StudentListService
  ) {} 

  ngOnInit(): void {
    this.cohortId = this.route.snapshot.paramMap.get('id') || '';
    this.loadCohort();

    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        const trimmed = query.trim();
        if (!trimmed || trimmed.length < 3) {
          return of([]);
        }
        return this.studentListService.searchUnassignedStudents(trimmed).pipe(
          catchError(err => {
            console.error('Search error:', err);
            return of([]);
          })
        );
    })
    ).subscribe(results => {
      this.searchResults = results.filter(
        student => !this.enrolledStudents.some(enrolled => enrolled.id === student.id)
      );
      this.showDropdown = this.searchResults.length > 0;

    });
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  loadCohort(): void {
    this.isLoading = true;
    this.cohortService.getCohortById(this.cohortId).subscribe({
      next: (cohort: any) => {
        this.cohortName = cohort.name;
        const studentIds: string[] = cohort.studentIds || [];
        if (studentIds.length > 0) {
          this.loadEnrolledStudents(studentIds);
        } else {
          this.enrolledStudents = [];
          this.isLoading = false;
        }
      },
      error: (error: any) => {
        console.error('Error loading cohort:', error);
        this.isLoading = false;
      }
    });
  }

  private loadEnrolledStudents(studentIds: string[]): void {
    this.studentListService.getStudents().subscribe({
      next: (allStudents: any[]) => {
        this.enrolledStudents = allStudents.filter(student => studentIds.includes(student.id));
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading enrolled students:', error);
        this.enrolledStudents = [];
        this.isLoading = false;
      }
    });
  }

  onTypeSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  addStudent(student: any): void {
    this.cohortService.addStudentToCohort(this.cohortId, student.id).subscribe({
      next: () => {
        this.enrolledStudents.push(student);
        this.clearSearch();
      },
      error: (err) => console.error('Error adding student:', err)
    });
  }

  removeStudent(studentId: string): void {
    this.cohortService.removeStudentFromCohort(this.cohortId, studentId).subscribe({
      next: () => {
        this.enrolledStudents = this.enrolledStudents.filter(student => student.id !== studentId);
      },
      error: (err) => console.error('Error removing student:', err)
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.showDropdown = false;
  }

  saveCohort(): void {
    this.isSaving = true;
    const payload = {
      name: this.cohortName,
    };
    this.cohortService.updateCohort(this.cohortId, payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/admin/cohorts']);
      },
      error: (err) => {
        console.error('Error saving cohort:', err);
        this.isSaving = false;
      }
    });
  }
}


