import { Routes } from '@angular/router';

import { HomeComponent } from './public/home/home';
import { Dashboard } from './private/student/dashboard/dashboard';
import { Signin } from './public/signin/signin';
import { AuthGuard } from './guards/auth.guard';
import { AdminModule } from './admin/admin-module';
import { LessonView } from './private/student/lesson-view/lesson-view';
import { TeacherDashboard } from './private/teacher/teacher-dashboard/teacher-dashboard';
import { TeacherLessonsView } from './private/teacher/teacher-lessons-view/teacher-lessons-view';
import { TeacherLessonsList } from './private/teacher/teacher-lessons-list/teacher-lessons-list';
import { TeacherCohortsList } from './private/teacher/teacher-cohorts-list/teacher-cohorts-list';
import { ResetPassword } from './public/signin/oauth-success/reset-password/reset-password';
import { GuestGuard } from './guards/guest.guard';
import { Onboarding } from './private/student/onboarding/onboarding';
import { Enrollment } from './private/student/enrollment/enrollment';
import { StudentOnboardingGuard } from './guards/student-onboarding.guard';
import { Policy } from './public/policy/policy';

export const routes: Routes = [
   
   { path:'', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, canActivate: [GuestGuard] },
    {path: 'policy',component: Policy, canActivate: [GuestGuard] },
   
    
    { path: 'signin', component: Signin, canActivate: [GuestGuard] },
    { path: 'reset-password', component: ResetPassword },
    {path: 'oauth-success', loadComponent: () => import('./public/signin/oauth-success/oauth-success').then(m => m.OauthSuccess)},

    // student area

    {path: 'student/onboarding', component: Onboarding, canActivate: [AuthGuard, StudentOnboardingGuard], data: { roles: ['STUDENT'] } },
    {path: 'student/enrollment', component: Enrollment, canActivate: [AuthGuard, StudentOnboardingGuard], data: { roles: ['STUDENT'] } },

    { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard], data: { roles: ['STUDENT'] } },
    { path: 'dashboard/lesson/:id', component: LessonView, canActivate: [AuthGuard], data: { roles: ['STUDENT'] } },


    { path: 'admin', loadChildren: () => import('./admin/admin-module').then(m => m.AdminModule), canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
    
    {path: 'teacher/dashboard' , component: TeacherDashboard, canActivate: [AuthGuard], data: { roles: ['TEACHER'] } },
    {path: 'teacher/resources' , component: TeacherLessonsList, canActivate: [AuthGuard], data: { roles: ['TEACHER'] } },
    {path: 'teacher/resources/:id' , component: TeacherLessonsView, canActivate: [AuthGuard], data: { roles: ['TEACHER'] } },
    {path: 'teacher/cohorts', component: TeacherCohortsList, canActivate: [AuthGuard], data: { roles: ['TEACHER'] } }


];


