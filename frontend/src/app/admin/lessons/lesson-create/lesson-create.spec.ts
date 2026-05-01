import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonCreate } from './lesson-create';

describe('LessonCreate', () => {
  let component: LessonCreate;
  let fixture: ComponentFixture<LessonCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
