import { TestBed } from '@angular/core/testing';

import { TestPlayService } from './test-play.service';

describe('TestPlayService', () => {
  let service: TestPlayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestPlayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
