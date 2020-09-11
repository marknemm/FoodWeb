import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDateTimeComponent } from './app-date-time.component';

describe('AppDateTimeComponent', () => {
  let component: AppDateTimeComponent;
  let fixture: ComponentFixture<AppDateTimeComponent>;

  beforeEach(async(() => {
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
