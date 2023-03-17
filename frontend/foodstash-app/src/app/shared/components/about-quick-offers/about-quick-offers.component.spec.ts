import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutQuickOffersComponent } from './about-quick-offers.component';

describe('AboutQuickOffersComponent', () => {
  let component: AboutQuickOffersComponent;
  let fixture: ComponentFixture<AboutQuickOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutQuickOffersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutQuickOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
