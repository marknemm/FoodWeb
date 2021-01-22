import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationHubRegistrationComponent } from './donation-hub-registration.component';

describe('DonationHubRegistrationComponent', () => {
  let component: DonationHubRegistrationComponent;
  let fixture: ComponentFixture<DonationHubRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationHubRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationHubRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
