import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingBlogsComponent } from './landing-blogs.component';

describe('LandingBlogsComponent', () => {
  let component: LandingBlogsComponent;
  let fixture: ComponentFixture<LandingBlogsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingBlogsComponent]
    });
    fixture = TestBed.createComponent(LandingBlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
