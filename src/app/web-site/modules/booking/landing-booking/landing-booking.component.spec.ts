import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingBookingComponent } from './landing-booking.component';

describe('LandingBookingComponent', () => {
  let component: LandingBookingComponent;
  let fixture: ComponentFixture<LandingBookingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingBookingComponent]
    });
    fixture = TestBed.createComponent(LandingBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
