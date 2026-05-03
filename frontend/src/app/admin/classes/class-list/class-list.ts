import { Component, OnInit } from '@angular/core';
import { ClassSession } from '../../models/class-session.model';
import { ClassSessionService } from '../../service/class-session';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-class-list',
  imports: [CommonModule],
  templateUrl: './class-list.html',
  styleUrl: './class-list.css',
})
export class ClassList implements OnInit {

  classes: ClassSession[] = [];

  constructor(
    private classSessionService: ClassSessionService
  ) {}

  ngOnInit(): void {
    this.loadClassSessions();
  }

  loadClassSessions() {
    this.classSessionService.getAllSessions().subscribe({
      next: (data) => {
        this.classes = data;
      },
      error: (err) => {
        console.error('Error fetching class sessions:', err);
      }
    });
  }

}
