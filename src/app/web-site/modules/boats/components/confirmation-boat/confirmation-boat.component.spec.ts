import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationBoatComponent } from './confirmation-boat.component';

describe('ConfirmationBoatComponent', () => {
  let component: ConfirmationBoatComponent;
  let fixture: ComponentFixture<ConfirmationBoatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmationBoatComponent]
    });
    fixture = TestBed.createComponent(ConfirmationBoatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
