import { Component, OnInit } from '@angular/core';
import { ClassSessionList } from '../../../model/ClassSessionList.model';
import { ClassSessionService } from '../../service/class-session';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-class-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './class-list.html',
  styleUrl: './class-list.css',
})
export class ClassList implements OnInit {

  classes: ClassSessionList[] = [];

  isLoading = true;

  constructor(
    private classSessionService: ClassSessionService
  ) {}

  ngOnInit(): void {
    this.loadClassSessions();
  }

  loadClassSessions() {
    this.isLoading = true;
   
    this.classSessionService.getAllClassSessions().subscribe({
      next: (data) => {
        this.classes = data;
        this.isLoading = false;
        console.log(this.classes);
      },
      error: (err) => {
        console.error('Error fetching class sessions:', err);
        this.isLoading = false;
      }
    });
  }

  deleteClassSession(sessionId: string) {
    if (confirm('Are you sure you want to delete this class session?')) {
      this.classSessionService.deleteClassSession(sessionId).subscribe({
        next: () => {
          this.loadClassSessions(); // Refresh the list after deletion
        },
        error: (err) => {
          console.error('Error deleting class session:', err);
        }
      });
    }
  }

}