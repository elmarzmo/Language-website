import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCohort } from './create-cohort';

describe('CreateCohort', () => {
  let component: CreateCohort;
  let fixture: ComponentFixture<CreateCohort>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCohort]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCohort);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
