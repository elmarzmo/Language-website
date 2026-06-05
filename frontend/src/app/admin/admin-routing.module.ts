import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LessonList } from './lessons/lesson-list/lesson-list';
import { LessonCreate } from './lessons/lesson-create/lesson-create';
import { ClassCreate } from './classes/class-create/class-create';
import { ClassList } from './classes/class-list/class-list';
import { AdminDashboard } from './admin-dashboard/adminDashboard' 
import { LessonEdit } from './lessons/lesson-edit/lesson-edit';
import { AdminLessonView } from './lessons/admin-lesson-view/admin-lesson-view';
import { StudentList } from './student-list/student-list'
import { CreateCohort } from './cohort/create-cohort/create-cohort';
import { CohortList } from './cohort/cohort/cohort';
import { EditCohort } from './cohort/edit-cohort/edit-cohort';

const routes: Routes = [
  {path: '', component: AdminDashboard },
  {path: 'lessons', component: LessonList},
  {path: 'lessons/create', component: LessonCreate},
  {path: 'lessons/:id/edit', component: LessonEdit},
  {path: 'lessons/view/:id', component: AdminLessonView},

  {path: 'classes', component: ClassList},
  {path: 'classes/create', component: ClassCreate},

  {path: 'students', component: StudentList},

  {path: 'cohorts', component: CohortList},
  {path: 'cohorts/create', component: CreateCohort},
  {path: 'cohorts/:id/edit', component: EditCohort},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
