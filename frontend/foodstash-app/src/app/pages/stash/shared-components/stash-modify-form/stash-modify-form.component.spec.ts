import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StashModifyFormComponent } from './stash-modify-form.component';

describe('StashModifyFormComponent', () => {
  let component: StashModifyFormComponent;
  let fixture: ComponentFixture<StashModifyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StashModifyFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StashModifyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
