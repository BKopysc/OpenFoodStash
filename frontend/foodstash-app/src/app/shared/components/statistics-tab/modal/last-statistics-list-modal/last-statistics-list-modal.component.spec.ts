import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastStatisticsListModalComponent } from './last-statistics-list-modal.component';

describe('LastStatisticsListModalComponent', () => {
  let component: LastStatisticsListModalComponent;
  let fixture: ComponentFixture<LastStatisticsListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LastStatisticsListModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastStatisticsListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
