import { TestBed } from '@angular/core/testing';

import { ClassSession } from './class-session';

describe('ClassSession', () => {
  let service: ClassSession;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassSession);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
