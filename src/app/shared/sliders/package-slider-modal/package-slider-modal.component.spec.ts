import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageSliderModalComponent } from './package-slider-modal.component';

describe('PackageSliderModalComponent', () => {
  let component: PackageSliderModalComponent;
  let fixture: ComponentFixture<PackageSliderModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PackageSliderModalComponent]
    });
    fixture = TestBed.createComponent(PackageSliderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
