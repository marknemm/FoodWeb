import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import 'jasmine';
import { AdminCreateDonationComponent } from './admin-create-donation.component';

describe('AdminCreateDonationComponent', () => {
  let component: AdminCreateDonationComponent;
  let fixture: ComponentFixture<AdminCreateDonationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCreateDonationComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCreateDonationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
