import 'jasmine';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DateTimeRangeRadioComponent } from './date-time-range-radio.component';

describe('DateTimeRangeRadioComponent', () => {
  let component: DateTimeRangeRadioComponent;
  let fixture: ComponentFixture<DateTimeRangeRadioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DateTimeRangeRadioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateTimeRangeRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
