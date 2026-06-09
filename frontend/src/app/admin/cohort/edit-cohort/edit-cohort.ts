import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, catchError, distinctUntilChanged, forkJoin, of } from 'rxjs';
import { CohortService } from '../../service/cohort.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { StudentListService } from '../../service/student-list';
import { TeacherListService } from '../../service/teacher-list';
import { User } from '../../models/user.model';
import { Cohort } from '../../models/cohort.model';

@Component({
  selector: 'app-edit-cohort',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './edit-cohort.html',
  styleUrl: './edit-cohort.css',
})
export class EditCohort implements OnInit, OnDestroy {
  cohortId: string = '';
  cohortName: string = '';
  enrolledStudents: User[] = [];
  cohortTeachers: User[] = [];
  
  isLoading = true;
  isSaving = false;
  isDeleting = false;

  // Search States
  studentSearchQuery: string = '';
  teacherSearchQuery: string = '';
  studentSearchResults: User[] = [];
  teacherSearchResults: User[] = [];
  
  showStudentDropdown = false;
  showTeacherDropdown = false;
  showTeacherSearchField = false;

  private studentSearchSubject = new Subject<string>();
  private teacherSearchSubject = new Subject<string>();
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private cohortService: CohortService,
    private router: Router,
    private studentListService: StudentListService,
    private teacherListService: TeacherListService
  ) {} 

  ngOnInit(): void {
    this.cohortId = this.route.snapshot.paramMap.get('id') || '';
    this.loadCohort();

    // Student Search Stream
    const studentSub = this.studentSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        const trimmed = query.trim();
        if (trimmed.length < 3) return of([]);
        return this.studentListService.searchUnassignedStudents(trimmed).pipe(
          catchError(err => {
            console.error('Student search error:', err);
            return of([]);
          })
        );
      })
    ).subscribe(results => {
      this.studentSearchResults = results.filter(
        student => !this.enrolledStudents.some(enrolled => enrolled.id === student.id)
      );
      this.showStudentDropdown = this.studentSearchResults.length > 0;
    });

    // Teacher Search Stream
    const teacherSub = this.teacherSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        const trimmed = query.trim();
        if (trimmed.length < 2) return of([]); // Teachers list might be smaller, 2 chars is fine
        return this.teacherListService.searchUnassignedTeachers(trimmed).pipe(
          catchError(err => {
            console.error('Teacher search error:', err);
            return of([]);
          })
        );
      })
    ).subscribe(results => {
      // Basic client-side filter example if backend doesn't search natively
     
      this.teacherSearchResults = results.filter(teacher => 
        !this.cohortTeachers.some(current => current.id === teacher.id)
      );
      this.showTeacherDropdown = this.teacherSearchResults.length > 0;
    });

    this.subscriptions.add(studentSub);
    this.subscriptions.add(teacherSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadCohort(): void {
    this.isLoading = true;

    this.cohortService.getCohortById(this.cohortId).subscribe({
      next: (cohort: Cohort) => {
        forkJoin({
          students: this.studentListService.getStudents(),
          teachers: this.teacherListService.getTeachers()
          
        }).subscribe({
          next: ({ students, teachers }) => {

        this.cohortName = cohort.name;
        this.enrolledStudents = students.filter(
          student => cohort.studentIds?.includes(student.id)
        );
       

        
        const teacher = teachers.find((t => t.id === cohort.teacherId));
        this.cohortTeachers = teacher ? [teacher] : [];
        this.isLoading = false;

      },
      error: err => {
        console.error('Error loading cohort details:', err);
        this.isLoading = false;
      } 
    });
            

        
      },
      error: (err) => {
        console.error('Error loading cohort:', err);
        this.isLoading = false;
      } 
    });
  }

 

  onStudentType(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.studentSearchSubject.next(value);
  }

  onTeacherType(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.teacherSearchSubject.next(value);
  }

  addStudent(student: User): void {
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

  assignTeacher(teacher: User): void {
    const payload = { name: this.cohortName, teacherId: teacher.id };
    this.cohortService.updateCohort(this.cohortId, payload).subscribe({
      next: () => {
        this.cohortTeachers = [teacher];
        this.showTeacherSearchField = false;
        this.clearSearch();
      },
      error: (err) => console.error('Error assigning teacher:', err)
    });
  }

  removeTeacher(): void {
    if (confirm('Are you sure you want to remove this teacher from the cohort?')) {
      const payload = { name: this.cohortName, teacherId: this.cohortTeachers[0]?.id ? '' : undefined };
      this.cohortService.updateCohort(this.cohortId, payload).subscribe({
        next: () => {
          this.cohortTeachers = [];
        },
        error: (err) => console.error('Error removing teacher:', err)
      });
    }
  }

  clearSearch(): void {
    this.studentSearchQuery = '';
    this.teacherSearchQuery = '';
    this.studentSearchResults = [];
    this.teacherSearchResults = [];
    this.showStudentDropdown = false;
    this.showTeacherDropdown = false;
  }

  saveCohort(): void {
    this.isSaving = true;
    const payload = { name: this.cohortName };
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

  confirmDelete(): void {
    if (confirm('🛑 WARNING: This will permanently delete this cohort group. Are you absolutely sure?')) {
      this.isDeleting = true;
      this.cohortService.deleteCohort(this.cohortId).subscribe({
        next: () => this.router.navigate(['/admin/cohorts']),
        error: (err) => {
          console.error('Error deleting cohort:', err);
          this.isDeleting = false;
        }
      });
    } 
  }
  
  
}