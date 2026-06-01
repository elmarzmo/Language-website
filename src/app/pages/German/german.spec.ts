import { ComponentFixture, TestBed } from '@angular/core/testing';

import { German } from './german';

describe('German', () => {
  let component: German;
  let fixture: ComponentFixture<German>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [German]
    })
    .compileComponents();

    fixture = TestBed.createComponent(German);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
