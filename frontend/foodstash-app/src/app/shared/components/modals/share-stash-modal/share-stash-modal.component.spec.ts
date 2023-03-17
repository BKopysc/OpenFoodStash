import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareStashModalComponent } from './share-stash-modal.component';

describe('ShareStashModalComponent', () => {
  let component: ShareStashModalComponent;
  let fixture: ComponentFixture<ShareStashModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareStashModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareStashModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
