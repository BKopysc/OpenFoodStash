import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodHistoryTableComponent } from './food-history-table.component';

describe('FoodHistoryTableComponent', () => {
  let component: FoodHistoryTableComponent;
  let fixture: ComponentFixture<FoodHistoryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoodHistoryTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodHistoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
