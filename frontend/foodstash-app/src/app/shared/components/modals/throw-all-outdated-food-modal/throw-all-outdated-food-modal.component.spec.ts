import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThrowAllOutdatedFoodModalComponent } from './throw-all-outdated-food-modal.component';

describe('ThrowAllOutdatedFoodModalComponent', () => {
  let component: ThrowAllOutdatedFoodModalComponent;
  let fixture: ComponentFixture<ThrowAllOutdatedFoodModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThrowAllOutdatedFoodModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThrowAllOutdatedFoodModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
