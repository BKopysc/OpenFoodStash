import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareInfoStashModalComponent } from './share-info-stash-modal.component';

describe('ShareInfoStashModalComponent', () => {
  let component: ShareInfoStashModalComponent;
  let fixture: ComponentFixture<ShareInfoStashModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareInfoStashModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareInfoStashModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
