import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationHubDonateComponent } from './donation-hub-donate.component';

describe('DonationHubDonateComponent', () => {
  let component: DonationHubDonateComponent;
  let fixture: ComponentFixture<DonationHubDonateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationHubDonateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationHubDonateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
