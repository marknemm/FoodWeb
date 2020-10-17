import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import 'jasmine';
import { AdminScheduleDeliveryDialogComponent } from './admin-schedule-delivery-dialog.component';

describe('AdminScheduleDeliveryDialogComponent', () => {
  let component: AdminScheduleDeliveryDialogComponent;
  let fixture: ComponentFixture<AdminScheduleDeliveryDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminScheduleDeliveryDialogComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminScheduleDeliveryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
