import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageModifyModalComponent } from './storage-modify-modal.component';

describe('StorageModifyModalComponent', () => {
  let component: StorageModifyModalComponent;
  let fixture: ComponentFixture<StorageModifyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StorageModifyModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorageModifyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
