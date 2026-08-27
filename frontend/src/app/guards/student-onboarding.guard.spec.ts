import { TestBed } from '@angular/core/testing';

import { StudentOnboardingGuard } from './student-onboarding.guard';

describe('StudentOnboardingGuard', () => {
  let service: StudentOnboardingGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentOnboardingGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
