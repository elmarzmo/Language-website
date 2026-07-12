import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Auth } from './auth';

describe('Auth', () => {
  let service: Auth;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(Auth);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should clear auth data and update login state on logout', () => {
    localStorage.setItem('Token', 'token');
    localStorage.setItem('RefreshToken', 'refresh-token');
    localStorage.setItem('Role', 'student');

    service.logout();

    const req = httpMock.expectOne('http://localhost:8080/api/auth/logout');
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Logged out successfully' });

    expect(localStorage.getItem('Token')).toBeNull();
    expect(localStorage.getItem('RefreshToken')).toBeNull();
    expect(localStorage.getItem('Role')).toBeNull();
    expect(service.isLoggedIn()).toBeFalse();
  });
});
