import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DateTimeSelectComponent } from './date-time-select.component';

describe('DateTimeSelectComponent', () => {
  let component: DateTimeSelectComponent;
  let fixture: ComponentFixture<DateTimeSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateTimeSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateTimeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
