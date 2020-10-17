import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppDateTimeComponent } from './app-date-time.component';

describe('AppDateTimeComponent', () => {
  let component: AppDateTimeComponent;
  let fixture: ComponentFixture<AppDateTimeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppDateTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppDateTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
