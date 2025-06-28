import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingFaqComponent } from './landing-faq.component';

describe('LandingFaqComponent', () => {
  let component: LandingFaqComponent;
  let fixture: ComponentFixture<LandingFaqComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingFaqComponent]
    });
    fixture = TestBed.createComponent(LandingFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
