import { Component, Input, OnInit } from '@angular/core';
import { Account, DonationHub, DonationHubPledge } from '~shared';

@Component({
  selector: 'foodweb-donation-hub-pledge-teaser',
  templateUrl: './donation-hub-pledge-teaser.component.html',
  styleUrls: ['./donation-hub-pledge-teaser.component.scss']
})
export class DonationHubPledgeTeaserComponent implements OnInit {

  @Input() featureHubAccount = false;
  @Input() pledge: DonationHubPledge;

  constructor() {}

  get donationHub(): DonationHub {
    return this.pledge?.donationHub;
  }

  get featuredAccount(): Account {
    return (this.featureHubAccount && this.hubAccount)
      ? this.hubAccount
      : this.pledgeAccount;
  }

  get hubAccount(): Account {
    return this.pledge?.donationHub?.volunteerAccount;
  }

  get pledgeAccount(): Account {
    return this.pledge?.account;
  }

  ngOnInit() {}
}
