import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingBoatsComponent } from './landing-boats.component';

describe('LandingBoatsComponent', () => {
  let component: LandingBoatsComponent;
  let fixture: ComponentFixture<LandingBoatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingBoatsComponent]
    });
    fixture = TestBed.createComponent(LandingBoatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
