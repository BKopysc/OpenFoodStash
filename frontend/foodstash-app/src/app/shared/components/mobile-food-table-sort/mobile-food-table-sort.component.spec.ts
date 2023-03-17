import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileFoodTableSortComponent } from './mobile-food-table-sort.component';

describe('MobileFoodTableSortComponent', () => {
  let component: MobileFoodTableSortComponent;
  let fixture: ComponentFixture<MobileFoodTableSortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileFoodTableSortComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileFoodTableSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
