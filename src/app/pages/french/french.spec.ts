import { ComponentFixture, TestBed } from '@angular/core/testing';

import { French } from './french';

describe('French', () => {
  let component: French;
  let fixture: ComponentFixture<French>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [French]
    })
    .compileComponents();

    fixture = TestBed.createComponent(French);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
