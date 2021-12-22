import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationHubPledgeTeaserComponent } from './donation-hub-pledge-teaser.component';

describe('DonationHubPledgeTeaserComponent', () => {
  let component: DonationHubPledgeTeaserComponent;
  let fixture: ComponentFixture<DonationHubPledgeTeaserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationHubPledgeTeaserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationHubPledgeTeaserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
