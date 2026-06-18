export type CohortLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface Cohort{
    id?: string;
    name: string;
    level: CohortLevel;
    maxStudents: number;
    teacherId: string;
    studentIds?: string[];
    startDate: string;
    active?:boolean;
}