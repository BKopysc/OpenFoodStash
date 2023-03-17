import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StashShareAcceptPageComponent } from './stash-share-accept-page.component';

describe('StashShareAcceptPageComponent', () => {
  let component: StashShareAcceptPageComponent;
  let fixture: ComponentFixture<StashShareAcceptPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StashShareAcceptPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StashShareAcceptPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
