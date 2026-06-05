import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCohort } from './edit-cohort';

describe('EditCohort', () => {
  let component: EditCohort;
  let fixture: ComponentFixture<EditCohort>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCohort]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCohort);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
