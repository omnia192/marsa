import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingLiveboardComponent } from './landing-liveboard.component';

describe('LandingLiveboardComponent', () => {
  let component: LandingLiveboardComponent;
  let fixture: ComponentFixture<LandingLiveboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingLiveboardComponent]
    });
    fixture = TestBed.createComponent(LandingLiveboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
