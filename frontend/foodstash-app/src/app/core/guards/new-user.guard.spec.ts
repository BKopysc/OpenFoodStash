import { TestBed } from '@angular/core/testing';

import { NewUserGuard } from './new-user.guard';

describe('NewUserGuard', () => {
  let guard: NewUserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NewUserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
