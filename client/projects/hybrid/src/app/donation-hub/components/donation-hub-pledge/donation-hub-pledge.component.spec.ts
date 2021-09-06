import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationHubPledgeComponent } from './donation-hub-pledge.component';

describe('DonationHubPledgeComponent', () => {
  let component: DonationHubPledgeComponent;
  let fixture: ComponentFixture<DonationHubPledgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationHubPledgeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationHubPledgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
