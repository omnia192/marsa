import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPackagesComponent } from './landing-packages.component';

describe('LandingPackagesComponent', () => {
  let component: LandingPackagesComponent;
  let fixture: ComponentFixture<LandingPackagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingPackagesComponent]
    });
    fixture = TestBed.createComponent(LandingPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
