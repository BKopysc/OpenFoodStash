import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EatFoodModalComponent } from './eat-food-modal.component';

describe('EatFoodModalComponent', () => {
  let component: EatFoodModalComponent;
  let fixture: ComponentFixture<EatFoodModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EatFoodModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EatFoodModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
