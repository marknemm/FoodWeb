import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTimeDisplayComponent } from './date-time-display.component';

describe('DateTimeDisplayComponent', () => {
  let component: DateTimeDisplayComponent;
  let fixture: ComponentFixture<DateTimeDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateTimeDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateTimeDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
