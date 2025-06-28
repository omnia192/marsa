import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistSingleComponent } from './wishlist-single.component';

describe('WishlistSingleComponent', () => {
  let component: WishlistSingleComponent;
  let fixture: ComponentFixture<WishlistSingleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WishlistSingleComponent]
    });
    fixture = TestBed.createComponent(WishlistSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
