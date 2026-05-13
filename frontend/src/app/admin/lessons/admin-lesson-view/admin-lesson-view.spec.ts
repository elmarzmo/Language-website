import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLessonView } from './admin-lesson-view';

describe('LessonView', () => {
  let component: AdminLessonView;
  let fixture: ComponentFixture<AdminLessonView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLessonView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLessonView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
