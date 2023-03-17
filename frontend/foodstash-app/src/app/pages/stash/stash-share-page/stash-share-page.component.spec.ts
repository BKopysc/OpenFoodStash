import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StashSharePageComponent } from './stash-share-page.component';

describe('StashSharePageComponent', () => {
  let component: StashSharePageComponent;
  let fixture: ComponentFixture<StashSharePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StashSharePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StashSharePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
