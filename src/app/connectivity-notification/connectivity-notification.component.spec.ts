import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectivityNotificationComponent } from './connectivity-notification.component';

describe('ConnectivityNotificationComponent', () => {
  let component: ConnectivityNotificationComponent;
  let fixture: ComponentFixture<ConnectivityNotificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectivityNotificationComponent]
    });
    fixture = TestBed.createComponent(ConnectivityNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
