import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StashCreatePageComponent } from './stash-create-page.component';

describe('StashCreatePageComponent', () => {
  let component: StashCreatePageComponent;
  let fixture: ComponentFixture<StashCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StashCreatePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StashCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
