import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticChartTileComponent } from './statistic-chart-tile.component';

describe('StatisticChartTileComponent', () => {
  let component: StatisticChartTileComponent;
  let fixture: ComponentFixture<StatisticChartTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatisticChartTileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticChartTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
