import { TestBed, async, inject } from '@angular/core/testing';

import { UserAuthenticateGuard } from './user-authenticate.guard';

describe('UserAuthenticateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserAuthenticateGuard]
    });
  });

  it('should ...', inject([UserAuthenticateGuard], (guard: UserAuthenticateGuard) => {
    expect(guard).toBeTruthy();
  }));
});
