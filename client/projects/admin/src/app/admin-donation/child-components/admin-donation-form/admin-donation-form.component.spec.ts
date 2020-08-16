import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDonationFormComponent } from './admin-donation-form.component';

describe('AdminDonationFormComponent', () => {
  let component: AdminDonationFormComponent;
  let fixture: ComponentFixture<AdminDonationFormComponent>;

  beforeEach(async(() => {
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
