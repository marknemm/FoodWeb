import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationHubPledgeActionsComponent } from './donation-hub-pledge-actions.component';

describe('DonationHubPledgeActionsComponent', () => {
  let component: DonationHubPledgeActionsComponent;
  let fixture: ComponentFixture<DonationHubPledgeActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationHubPledgeActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationHubPledgeActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
