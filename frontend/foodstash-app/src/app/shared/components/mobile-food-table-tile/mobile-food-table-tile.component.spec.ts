import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileFoodTableTileComponent } from './mobile-food-table-tile.component';

describe('MobileFoodTableTileComponent', () => {
  let component: MobileFoodTableTileComponent;
  let fixture: ComponentFixture<MobileFoodTableTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileFoodTableTileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileFoodTableTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
