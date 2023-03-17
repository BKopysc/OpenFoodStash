import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingOverallTileComponent } from './loading-overall-tile.component';

describe('LoadingOverallTileComponent', () => {
  let component: LoadingOverallTileComponent;
  let fixture: ComponentFixture<LoadingOverallTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadingOverallTileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingOverallTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
