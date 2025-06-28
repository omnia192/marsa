import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveboardPaymentComponent } from './liveboard-payment.component';

describe('LiveboardPaymentComponent', () => {
  let component: LiveboardPaymentComponent;
  let fixture: ComponentFixture<LiveboardPaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LiveboardPaymentComponent]
    });
    fixture = TestBed.createComponent(LiveboardPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
