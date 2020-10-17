import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AdminDonationFormComponent } from './admin-donation-form.component';

describe('AdminDonationFormComponent', () => {
  let component: AdminDonationFormComponent;
  let fixture: ComponentFixture<AdminDonationFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDonationFormComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDonationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
