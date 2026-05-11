import { Component, OnInit } from '@angular/core';
import { ClassSession } from '../../models/class-session.model';
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

  classes: ClassSession[] = [];
  isLoading = true;

  constructor(
    private classSessionService: ClassSessionService
  ) {}

  ngOnInit(): void {
    this.loadClassSessions();
  }

  loadClassSessions() {
    this.isLoading = true;
    this.classSessionService.getAllSessions().subscribe({
      next: (data) => {
        this.classes = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching class sessions:', err);
        this.isLoading = false;
      }
    });
  }

}