import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LessonList } from './lessons/lesson-list/lesson-list';
import { LessonCreate } from './lessons/lesson-create/lesson-create';

const routes: Routes = [
  {path: 'lessons', component: LessonList},
  {path: 'lessons/create', component: LessonCreate},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
