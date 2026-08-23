import { TestBed } from '@angular/core/testing';

import { StudentOnboardingService } from './student-onboarding-service';

describe('StudentOnboardingService', () => {
  let service: StudentOnboardingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentOnboardingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
