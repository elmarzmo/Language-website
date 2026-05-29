import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherLessonsView } from './teacher-lessons-view';

describe('TeacherLessonsView', () => {
  let component: TeacherLessonsView;
  let fixture: ComponentFixture<TeacherLessonsView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherLessonsView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherLessonsView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
