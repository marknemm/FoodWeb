import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppOperationHoursComponent } from './app-operation-hours.component';

describe('AppOperationHoursComponent', () => {
  let component: AppOperationHoursComponent;
  let fixture: ComponentFixture<AppOperationHoursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppOperationHoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppOperationHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
