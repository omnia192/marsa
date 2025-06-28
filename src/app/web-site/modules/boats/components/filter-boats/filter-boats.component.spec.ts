import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBoatsComponent } from './filter-boats.component';

describe('FilterBoatsComponent', () => {
  let component: FilterBoatsComponent;
  let fixture: ComponentFixture<FilterBoatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterBoatsComponent]
    });
    fixture = TestBed.createComponent(FilterBoatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
