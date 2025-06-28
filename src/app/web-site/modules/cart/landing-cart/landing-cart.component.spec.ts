import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingCartComponent } from './landing-cart.component';

describe('LandingCartComponent', () => {
  let component: LandingCartComponent;
  let fixture: ComponentFixture<LandingCartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingCartComponent]
    });
    fixture = TestBed.createComponent(LandingCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
