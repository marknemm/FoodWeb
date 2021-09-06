import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationHoursSettingsComponent } from './operation-hours-settings.component';

describe('OperationHoursSettingsComponent', () => {
  let component: OperationHoursSettingsComponent;
  let fixture: ComponentFixture<OperationHoursSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationHoursSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationHoursSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
