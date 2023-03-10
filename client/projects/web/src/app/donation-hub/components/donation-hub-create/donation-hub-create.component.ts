import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DonationHub } from '~shared';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { DonationHubForm } from '~web/donation-hub/forms/donation-hub.form';
import { DonationHubCreateService } from '~web/donation-hub/services/donation-hub-create/donation-hub-create.service';
import { FormFieldService } from '~web/forms';
import { SessionService } from '~web/session/services/session/session.service';
import { ShellService } from '~web/shell/services/shell/shell.service';

@Component({
  selector: 'foodweb-donation-hub-create',
  templateUrl: './donation-hub-create.component.html',
  styleUrls: ['./donation-hub-create.component.scss'],
  providers: [FormFieldService]
})
export class DonationHubCreateComponent implements OnInit {

  readonly minRegisterDate = new Date();
  readonly christmasDayDate = new Date('12/25/2021');

  readonly agreementChecklistMembers = [
    `I'll handle food safely`,
    `I won't participate if I'm sick`,
    `I'll notify FoodWeb if I'm ill`
  ];

  constructor(
    public shellService: ShellService,
    private _dateTimeService: DateTimeService,
    private _donationHubCreateService: DonationHubCreateService,
    private _formFieldService: FormFieldService<DonationHubForm>,
    private _router: Router,
    private _sessionService: SessionService,
  ) {
    this.shellService.pageTitle = 'Register Donation Hub';
  }

  get donationHubForm(): DonationHubForm {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => new DonationHubForm(this._dateTimeService, { account: this._sessionService.account })
    });
  }

  register(): void {
    this.donationHubForm.markAllAsTouched();
    if (this.donationHubForm.valid) {
      this._donationHubCreateService.createDonationHub(this.donationHubForm.toDonationHub()).subscribe(
        (donationHub: DonationHub) => this._router.navigate(['/donation-hub', donationHub.id])
      );
    }
  }

  filterDateSaturday(date: Date): boolean {
    // TODO: Remove very specific christmas eve date exception.
    return (date && (date.getDay() === 6 || (date.getFullYear() === 2021 && date.getMonth() === 11 && date.getDate() === 24)));
  }
}
