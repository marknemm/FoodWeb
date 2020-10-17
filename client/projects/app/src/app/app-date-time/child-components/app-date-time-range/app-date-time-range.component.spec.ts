import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppDateTimeRangeComponent } from './app-date-time-range.component';

describe('AppDateTimeRangeComponent', () => {
  let component: AppDateTimeRangeComponent;
  let fixture: ComponentFixture<AppDateTimeRangeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppDateTimeRangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppDateTimeRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
