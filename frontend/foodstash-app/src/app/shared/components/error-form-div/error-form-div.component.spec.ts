import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorFormDivComponent } from './error-form-div.component';

describe('ErrorFormDivComponent', () => {
  let component: ErrorFormDivComponent;
  let fixture: ComponentFixture<ErrorFormDivComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorFormDivComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorFormDivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
