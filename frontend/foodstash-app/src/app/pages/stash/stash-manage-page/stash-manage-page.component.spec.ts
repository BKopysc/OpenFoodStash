import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StashManagePageComponent } from './stash-manage-page.component';

describe('StashManagePageComponent', () => {
  let component: StashManagePageComponent;
  let fixture: ComponentFixture<StashManagePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StashManagePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StashManagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
