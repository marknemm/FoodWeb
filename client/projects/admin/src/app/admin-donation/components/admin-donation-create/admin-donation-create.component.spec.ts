import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import 'jasmine';
import { AdminDonationCreateComponent } from './admin-donation-create.component';

describe('AdminDonationCreateComponent', () => {
  let component: AdminDonationCreateComponent;
  let fixture: ComponentFixture<AdminDonationCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDonationCreateComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDonationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
