import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationHubPledgeCreateComponent } from './donation-hub-pledge-create.component';

describe('DonationHubPledgeCreateComponent', () => {
  let component: DonationHubPledgeCreateComponent;
  let fixture: ComponentFixture<DonationHubPledgeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationHubPledgeCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationHubPledgeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
