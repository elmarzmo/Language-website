import { ClassSession } from './class-session.model'; // Import your existing interface

export interface AdminDashboard {
  allClasses: ClassSession[];
  lessonCount: number;
  classCount: number;
}