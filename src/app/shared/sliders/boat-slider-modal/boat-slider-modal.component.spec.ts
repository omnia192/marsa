import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoatSliderModalComponent } from './boat-slider-modal.component';

describe('BoatSliderModalComponent', () => {
  let component: BoatSliderModalComponent;
  let fixture: ComponentFixture<BoatSliderModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoatSliderModalComponent]
    });
    fixture = TestBed.createComponent(BoatSliderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
