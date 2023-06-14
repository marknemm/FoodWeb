import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DonationHub } from '~shared';
import { DonationHubCreateService } from '~web/donation-hub/services/donation-hub-create/donation-hub-create.service';
import { DonationHubForm, DonationHubFormAdapter } from '~web/donation-hub/services/donation-hub-form-adapter/donation-hub-form-adapter.service';
import { FormFieldProviders, FormFieldService  } from '~web/forms';
import { SessionService } from '~web/session/services/session/session.service';
import { ShellService } from '~web/shell/services/shell/shell.service';

@Component({
  selector: 'foodweb-donation-hub-create',
  templateUrl: './donation-hub-create.component.html',
  styleUrls: ['./donation-hub-create.component.scss'],
  providers: [FormFieldProviders]
})
export class DonationHubCreateComponent implements OnInit {

  readonly minRegisterDate = new Date();

  readonly agreementChecklistMembers: ReadonlyArray<string> = [
    `I'll handle food safely`,
    `I won't participate if I'm sick`,
    `I'll notify FoodWeb if I'm ill`
  ];

  constructor(
    private _donationHubCreateService: DonationHubCreateService,
    private _donationHubFormAdapter: DonationHubFormAdapter,
    private _formFieldService: FormFieldService<DonationHubForm>,
    private _router: Router,
    private _sessionService: SessionService,
    private _shellService: ShellService,
  ) {
    this._shellService.pageTitle = 'Register Donation Hub';
  }

  get donationHubForm(): DonationHubForm {
    return this._formFieldService.control;
  }

  get pageTitle(): string {
    return this._shellService.pageTitle;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => this._donationHubFormAdapter.toForm({ account: this._sessionService.account })
    });
  }

  register(): void {
    this.donationHubForm.markAllAsTouched();
    if (this.donationHubForm.valid) {
      this._donationHubCreateService.createDonationHub(
        this._donationHubFormAdapter.toModel(this.donationHubForm)
      ).subscribe(
        (donationHub: DonationHub) => this._router.navigate(['/donation-hub', donationHub.id])
      );
    }
  }

  filterDateSaturday(date: Date): boolean {
    // TODO: Remove very specific christmas eve date exception.
    return (date && (date.getDay() === 6 || (date.getFullYear() === 2021 && date.getMonth() === 11 && date.getDate() === 24)));
  }
}
