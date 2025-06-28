import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingTransferComponent } from './landing-transfer.component';

describe('LandingTransferComponent', () => {
  let component: LandingTransferComponent;
  let fixture: ComponentFixture<LandingTransferComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingTransferComponent]
    });
    fixture = TestBed.createComponent(LandingTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
