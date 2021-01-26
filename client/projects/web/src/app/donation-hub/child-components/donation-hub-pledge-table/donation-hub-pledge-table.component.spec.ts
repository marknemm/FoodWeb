import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationHubPledgeTableComponent } from './donation-hub-pledge-table.component';

describe('DonationHubPledgeTableComponent', () => {
  let component: DonationHubPledgeTableComponent;
  let fixture: ComponentFixture<DonationHubPledgeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationHubPledgeTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationHubPledgeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
