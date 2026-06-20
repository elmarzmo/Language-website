export interface ClassSession {
  id?: string;
  cohortId: string;
  teacherId: string;
  lessonModuleId: string;
  dateTime: string | Date;
  durationMinutes: number;
  meetingLink?: string;
  status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
}