import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadLandingComponent } from './download-landing.component';

describe('DownloadLandingComponent', () => {
  let component: DownloadLandingComponent;
  let fixture: ComponentFixture<DownloadLandingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DownloadLandingComponent]
    });
    fixture = TestBed.createComponent(DownloadLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
