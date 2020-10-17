import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppOperationHoursInfoComponent } from './app-operation-hours-info.component';

describe('AppOperationHoursInfoComponent', () => {
  let component: AppOperationHoursInfoComponent;
  let fixture: ComponentFixture<AppOperationHoursInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppOperationHoursInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppOperationHoursInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
