import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AdminEditDonationComponent } from './admin-edit-donation.component';

describe('AdminEditDonationComponent', () => {
  let component: AdminEditDonationComponent;
  let fixture: ComponentFixture<AdminEditDonationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEditDonationComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminEditDonationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
