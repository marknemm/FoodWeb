import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DonationHub } from '~shared';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { DonationHubForm } from '~web/donation-hub/forms/donation-hub.form';
import { DonationHubCreateService } from '~web/donation-hub/services/donation-hub-create/donation-hub-create.service';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';
import { SessionService } from '~web/session/services/session/session.service';

@Component({
  selector: 'foodweb-donation-hub-registration',
  templateUrl: './donation-hub-registration.component.html',
  styleUrls: ['./donation-hub-registration.component.scss'],
  providers: formProvider(DonationHubRegistrationComponent)
})
export class DonationHubRegistrationComponent extends FormBaseComponent<DonationHubForm> implements OnInit {

  readonly minRegisterDate = new Date();

  readonly agreementChecklistMembers = [
    'I will refrigerate any sandwiches for donation to St. Luke’s from the time they are dropped off to my location until I transport them to St. Luke’s Mission for Mercy.',
    'I will follow all standard safety precautions when handling food, including wearing gloves when handling the sandwiches, tying long hair back (if applicable), and keeping the sandwiches away from other food and beverage products.',
    'I will notify FoodWeb, and will not handle any sandwiches or interact with any FoodWeb volunteer, if I display any symptoms of illness or COVID-19 (cough, fever, congestion, loss of taste/smell, etc.) on the day of the sandwich drive or 20 days before or after my participation.',
    'I will ensure that FoodWeb volunteers are able to drop-of sandwiches via a contactless manner.',
    'I acknowledge that my participation is on a strictly volunteer basis, I am not an employee of WNY Food Web, Inc., and no offer of employment is being made.',
    'I acknowledge that my participation is at my own risk, I expressly assume the risk of injury or harm arising from my participation (for example, the risk of contracting the virus that causes COVID-19), and I forever release and hold harmless form any and all liability, claims, damages, or demands of any kind arising from my participation (including claims arising from the negligence of WNY Food Web, Inc. or its directors, officers, agents, or employees).',
  ];

  readonly readyChecklistMembers = [
    'Do you have sufficient refrigeration space to hold between 200-300 sandwiches?',
    'After receiving the sandwiches, are you able to deliver them to St. Luke\'s Mission for Mercy?',
    'Do you have a valid driver\'s license?',
    'Do you have automotive insurance in accordance with NYS law?',
  ];

  constructor(
    dateTimeService: DateTimeService,
    formHelperService: FormHelperService,
    sessionService: SessionService,
    private _donationHubCreateService: DonationHubCreateService,
    private _router: Router
  ) {
    super(() => new DonationHubForm(dateTimeService, { account: sessionService.account }), formHelperService, true);
  }

  ngOnInit() {}

  register(): void {
    if (this.formGroup.checkValidity()) {
      this._donationHubCreateService.createDonationHub(this.formGroup.toDonationHub()).subscribe((donationHub: DonationHub) =>
        this._router.navigate(['/donation-hub', 'details', donationHub.id])
      );
    }
  }

  filterDateSaturday(date: Date): boolean {
    return (date && date.getDay() === 6);
  }
}
