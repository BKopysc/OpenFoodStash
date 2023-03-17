import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsFoodModalComponent } from './details-food-modal.component';

describe('DetailsFoodModalComponent', () => {
  let component: DetailsFoodModalComponent;
  let fixture: ComponentFixture<DetailsFoodModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsFoodModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsFoodModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
