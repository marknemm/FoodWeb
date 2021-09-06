import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationHubPledgeEditComponent } from './donation-hub-pledge-edit.component';

describe('DonationHubPledgeEditComponent', () => {
  let component: DonationHubPledgeEditComponent;
  let fixture: ComponentFixture<DonationHubPledgeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationHubPledgeEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationHubPledgeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
