import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFoodModalComponent } from './edit-food-modal.component';

describe('EditFoodModalComponent', () => {
  let component: EditFoodModalComponent;
  let fixture: ComponentFixture<EditFoodModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFoodModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFoodModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
