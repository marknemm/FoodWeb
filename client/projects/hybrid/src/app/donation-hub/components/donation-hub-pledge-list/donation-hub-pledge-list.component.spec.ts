import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationHubPledgeListComponent } from './donation-hub-pledge-list.component';

describe('DonationHubPledgeListComponent', () => {
  let component: DonationHubPledgeListComponent;
  let fixture: ComponentFixture<DonationHubPledgeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationHubPledgeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationHubPledgeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
