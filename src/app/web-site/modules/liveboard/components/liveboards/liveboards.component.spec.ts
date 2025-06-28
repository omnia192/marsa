import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveboardsComponent } from './liveboards.component';

describe('LiveboardsComponent', () => {
  let component: LiveboardsComponent;
  let fixture: ComponentFixture<LiveboardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LiveboardsComponent]
    });
    fixture = TestBed.createComponent(LiveboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
