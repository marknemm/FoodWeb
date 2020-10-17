import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppWeekdayOperationHoursComponent } from './app-weekday-operation-hours.component';

describe('AppWeekdayOperationHoursComponent', () => {
  let component: AppWeekdayOperationHoursComponent;
  let fixture: ComponentFixture<AppWeekdayOperationHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppWeekdayOperationHoursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppWeekdayOperationHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
