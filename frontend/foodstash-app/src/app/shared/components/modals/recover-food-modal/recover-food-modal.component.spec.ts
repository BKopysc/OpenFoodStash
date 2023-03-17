import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoverFoodModalComponent } from './recover-food-modal.component';

describe('RecoverFoodModalComponent', () => {
  let component: RecoverFoodModalComponent;
  let fixture: ComponentFixture<RecoverFoodModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecoverFoodModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoverFoodModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
