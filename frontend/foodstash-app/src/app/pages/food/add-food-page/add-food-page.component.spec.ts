import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFoodPageComponent } from './add-food-page.component';

describe('AddFoodPageComponent', () => {
  let component: AddFoodPageComponent;
  let fixture: ComponentFixture<AddFoodPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFoodPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFoodPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
