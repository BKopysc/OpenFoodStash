import { TestBed } from '@angular/core/testing';

import { FoodCategoryService } from './food-category.service';

describe('FoodCategoryService', () => {
  let service: FoodCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoodCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
