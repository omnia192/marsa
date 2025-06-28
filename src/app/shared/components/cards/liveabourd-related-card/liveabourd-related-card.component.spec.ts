import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveabourdRelatedCardComponent } from './liveabourd-related-card.component';

describe('LiveabourdRelatedCardComponent', () => {
  let component: LiveabourdRelatedCardComponent;
  let fixture: ComponentFixture<LiveabourdRelatedCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LiveabourdRelatedCardComponent]
    });
    fixture = TestBed.createComponent(LiveabourdRelatedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
