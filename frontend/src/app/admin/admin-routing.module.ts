import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LessonList } from './lessons/lesson-list/lesson-list';
import { LessonCreate } from './lessons/lesson-create/lesson-create';
import { ClassCreate } from './classes/class-create/class-create';
import { ClassList } from './classes/class-list/class-list';

const routes: Routes = [
  {path: 'lessons', component: LessonList},
  {path: 'lessons/create', component: LessonCreate},

  {path: 'classes', component: ClassList},
  {path: 'classes/create', component: ClassCreate}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
