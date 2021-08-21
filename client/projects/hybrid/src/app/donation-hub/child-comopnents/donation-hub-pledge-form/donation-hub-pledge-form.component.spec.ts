import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationHubPledgeFormComponent } from './donation-hub-pledge-form.component';

describe('DonationHubPledgeFormComponent', () => {
  let component: DonationHubPledgeFormComponent;
  let fixture: ComponentFixture<DonationHubPledgeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationHubPledgeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationHubPledgeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
