import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveToTrashFoodModalComponent } from './move-to-trash-food-modal.component';

describe('MoveToTrashFoodModalComponent', () => {
  let component: MoveToTrashFoodModalComponent;
  let fixture: ComponentFixture<MoveToTrashFoodModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveToTrashFoodModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoveToTrashFoodModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
