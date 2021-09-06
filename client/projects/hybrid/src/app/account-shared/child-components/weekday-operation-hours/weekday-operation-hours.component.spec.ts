import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekdayOperationHoursComponent } from './weekday-operation-hours.component';

describe('WeekdayOperationHoursComponent', () => {
  let component: WeekdayOperationHoursComponent;
  let fixture: ComponentFixture<WeekdayOperationHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeekdayOperationHoursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekdayOperationHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
