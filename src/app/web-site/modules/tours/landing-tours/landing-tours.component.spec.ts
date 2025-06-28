import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingToursComponent } from './landing-tours.component';

describe('LandingToursComponent', () => {
  let component: LandingToursComponent;
  let fixture: ComponentFixture<LandingToursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingToursComponent]
    });
    fixture = TestBed.createComponent(LandingToursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
