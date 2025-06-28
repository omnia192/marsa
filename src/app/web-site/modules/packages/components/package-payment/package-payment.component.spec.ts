import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagePaymentComponent } from './package-payment.component';

describe('PackagePaymentComponent', () => {
  let component: PackagePaymentComponent;
  let fixture: ComponentFixture<PackagePaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PackagePaymentComponent]
    });
    fixture = TestBed.createComponent(PackagePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
