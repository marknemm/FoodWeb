import 'jasmine';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AdminScheduleDeliveryDialogComponent } from './admin-schedule-delivery-dialog.component';

describe('AdminScheduleDeliveryDialogComponent', () => {
  let component: AdminScheduleDeliveryDialogComponent;
  let fixture: ComponentFixture<AdminScheduleDeliveryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminScheduleDeliveryDialogComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminScheduleDeliveryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});