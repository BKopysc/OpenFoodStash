import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticOverallTileComponent } from './statistic-overall-tile.component';

describe('StatisticOverallTileComponent', () => {
  let component: StatisticOverallTileComponent;
  let fixture: ComponentFixture<StatisticOverallTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatisticOverallTileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticOverallTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
