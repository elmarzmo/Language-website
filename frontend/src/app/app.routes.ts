import { Routes } from '@angular/router';
import { About } from './public/about/about';
import { Contact } from './public/contact/contact';
import { Home } from './public/home/home';
import { Dashboard } from './private/student/dashboard/dashboard';
import { Signin } from './public/signin/signin';
import { AuthGuard } from './guards/auth.guard';
import { AdminModule } from './admin/admin-module';
import { LessonView } from './private/student/lesson-view/lesson-view';
import { TeacherDashboard } from './private/teacher/teacher-dashboard/teacher-dashboard';
import { TeacherLessonsView } from './private/teacher/teacher-lessons-view/teacher-lessons-view';
import { TeacherLessonsList } from './private/teacher/teacher-lessons-list/teacher-lessons-list';
import { TeacherCohortsList } from './private/teacher/teacher-cohorts-list/teacher-cohorts-list';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'about', component: About },
    { path: 'contact', component: Contact },
    { path: 'signin', component: Signin },

    // student area

    { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard], data: { roles: ['STUDENT'] } },
    { path: 'dashboard/lesson/:id', component: LessonView, canActivate: [AuthGuard], data: { roles: ['STUDENT'] } },


    { path: 'admin', loadChildren: () => import('./admin/admin-module').then(m => m.AdminModule), canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
    
    {path: 'teacher/dashboard' , component: TeacherDashboard, canActivate: [AuthGuard], data: { roles: ['TEACHER'] } },
    {path: 'teacher/resources' , component: TeacherLessonsList, canActivate: [AuthGuard], data: { roles: ['TEACHER'] } },
    {path: 'teacher/resources/:id' , component: TeacherLessonsView, canActivate: [AuthGuard], data: { roles: ['TEACHER'] } },
    {path: 'teacher/cohorts', component: TeacherCohortsList, canActivate: [AuthGuard], data: { roles: ['TEACHER'] } }


];


