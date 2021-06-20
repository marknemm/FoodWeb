import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AdminDonationEditComponent } from './admin-donation-edit.component';

describe('AdminDonationEditComponent', () => {
  let component: AdminDonationEditComponent;
  let fixture: ComponentFixture<AdminDonationEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDonationEditComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDonationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
