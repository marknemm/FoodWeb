import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DonationHub } from '~shared';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { DonationHubForm } from '~web/donation-hub/forms/donation-hub.form';
import { DonationHubCreateService } from '~web/donation-hub/services/donation-hub-create/donation-hub-create.service';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';
import { SessionService } from '~web/session/services/session/session.service';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';

@Component({
  selector: 'foodweb-donation-hub-create',
  templateUrl: './donation-hub-create.component.html',
  styleUrls: ['./donation-hub-create.component.scss'],
  providers: formProvider(DonationHubCreateComponent)
})
export class DonationHubCreateComponent extends FormBaseComponent<DonationHubForm> implements OnInit {

  readonly minRegisterDate = new Date();

  readonly agreementChecklistMembers = [
    `I'll handle food safely`,
    `I won't participate if I'm sick`,
    `I'll notify FoodWeb if I'm ill`
  ];

  constructor(
    public pageTitleService: PageTitleService,
    private _donationHubCreateService: DonationHubCreateService,
    private _router: Router,
    dateTimeService: DateTimeService,
    formHelperService: FormHelperService,
    sessionService: SessionService,
  ) {
    super(() => new DonationHubForm(dateTimeService, { account: sessionService.account }), formHelperService, true);
  }

  ngOnInit() {
    this.pageTitleService.title = 'Register Donation Hub';
  }

  register(): void {
    if (this.formGroup.checkValidity()) {
      this._donationHubCreateService.createDonationHub(this.formGroup.toDonationHub()).subscribe((donationHub: DonationHub) =>
        this._router.navigate(['/donation-hub', donationHub.id])
      );
    }
  }

  filterDateSaturday(date: Date): boolean {
    return (date && date.getDay() === 6);
  }
}
