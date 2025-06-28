import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingWishlistComponent } from './landing-wishlist.component';

describe('LandingWishlistComponent', () => {
  let component: LandingWishlistComponent;
  let fixture: ComponentFixture<LandingWishlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingWishlistComponent]
    });
    fixture = TestBed.createComponent(LandingWishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
