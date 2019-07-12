import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTimeSelectDialogComponent } from './date-time-select-dialog.component';

describe('DateTimeSelectDialogComponent', () => {
  let component: DateTimeSelectDialogComponent;
  let fixture: ComponentFixture<DateTimeSelectDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateTimeSelectDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateTimeSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
