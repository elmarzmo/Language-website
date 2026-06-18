import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherCohortsList } from './teacher-cohorts-list';

describe('TeacherCohortsList', () => {
  let component: TeacherCohortsList;
  let fixture: ComponentFixture<TeacherCohortsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherCohortsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherCohortsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
