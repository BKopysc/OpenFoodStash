import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StashPageComponent } from './stash-page.component';

describe('StashPageComponent', () => {
  let component: StashPageComponent;
  let fixture: ComponentFixture<StashPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StashPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StashPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
