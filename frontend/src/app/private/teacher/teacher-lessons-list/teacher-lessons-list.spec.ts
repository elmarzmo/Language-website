import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherLessonsList } from './teacher-lessons-list';

describe('TeacherLessonsList', () => {
  let component: TeacherLessonsList;
  let fixture: ComponentFixture<TeacherLessonsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherLessonsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherLessonsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
