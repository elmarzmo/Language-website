import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Spanish } from './spanish';

describe('Spanish', () => {
  let component: Spanish;
  let fixture: ComponentFixture<Spanish>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Spanish]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Spanish);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
