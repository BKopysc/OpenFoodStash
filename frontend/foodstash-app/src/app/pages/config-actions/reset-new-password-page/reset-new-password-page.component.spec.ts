import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetNewPasswordPageComponent } from './reset-new-password-page.component';

describe('ResetNewPasswordPageComponent', () => {
  let component: ResetNewPasswordPageComponent;
  let fixture: ComponentFixture<ResetNewPasswordPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetNewPasswordPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetNewPasswordPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
