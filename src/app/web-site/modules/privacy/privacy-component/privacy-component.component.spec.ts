import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyComponentComponent } from './privacy-component.component';

describe('PrivacyComponentComponent', () => {
  let component: PrivacyComponentComponent;
  let fixture: ComponentFixture<PrivacyComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrivacyComponentComponent]
    });
    fixture = TestBed.createComponent(PrivacyComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
