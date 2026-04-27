/**
 * Models for the dynamic lesson system
 */

export interface LessonModule {
  id: string;
  title: string;
  description: string;
  createdBy: string; // teacher id
  createdDate: Date;
  updatedDate: Date;
  status: 'draft' | 'published' | 'archived';
  resources: LessonResource[];
  liveClass?: LiveClass;
  completionPercentage?: number;
  assignedStudents: string[]; // student ids
}

export interface LessonResource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'exercise' | 'reading' | 'link';
  url: string;
  description?: string;
  uploadedDate: Date;
  fileSize?: string;
  order: number; // for ordering resources
}

export interface LiveClass {
  id: string;
  moduleId: string;
  title: string;
  scheduledDate: Date;
  scheduledTime: string; // HH:MM format
  duration: number; // in minutes
  teacher: string; // teacher name/id
  meetingLink: string;
  description?: string;
  recordingLink?: string; // after class is conducted
  status: 'scheduled' | 'ongoing' | 'completed';
  attendees?: string[]; // student ids who attended
}

export interface StudentProgress {
  id: string;
  studentId: string;
  moduleId: string;
  completionPercentage: number;
  resourcesViewed: string[]; // resource ids viewed
  classAttended: boolean;
  notes?: string;
  lastUpdated: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}