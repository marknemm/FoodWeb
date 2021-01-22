import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DonationHubDonateForm } from '~web/donation-hub/forms/donation-hub-donate.form';
import { DonationHubPledgeCreateService } from '~web/donation-hub/services/donation-hub-pledge-create/donation-hub-pledge-create.service';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-donation-hub-donate',
  templateUrl: './donation-hub-donate.component.html',
  styleUrls: ['./donation-hub-donate.component.scss'],
  providers: formProvider(DonationHubDonateComponent)
})
export class DonationHubDonateComponent extends FormBaseComponent<DonationHubDonateForm> implements OnInit {

  readonly agreementChecklistMembers = [
    'I will follow all standard safety precautions when handling food, including washing my hands and/or wearing gloves, tying long hair back, and working in a clean and sanitized space away from any other food and beverage products.',
    'If I use meat or cheese products in my sandwiches, I will ensure that I purchase any such meat or cheese either the day before or the day that I prepare the sandwiches and will also confirm that the meat and/or cheese is fresh and edible.',
    'If I use peanut butter and/or jelly in my sandwiches, I will ensure that I use peanut butter and jelly from un-opened jars for purposes of preparing these sandwiches.',
    'I agree to refrigerate all sandwiches that I make until I transport them to the drop-off location.',
    'I will notify FoodWeb, and will not participate in any FoodWeb activities, if I display any symptoms of illness or COVID-19 (cough, fever, congestion, loss of taste/smell, etc.) on the day of the sandwich drive or 20 days before my participation.',
    'I acknowledge that my participation is on a strictly volunteer basis, I am not an employee of WNY Food Web, Inc., and no offer of employment is being made.',
    'I acknowledge that my participation is at my own risk, I expressly assume the risk of injury or harm arising from my participation (for example, the risk of contracting the virus that causes COVID-19), and I forever release and hold harmless from any and all liability, claims, damages, or demands of any kind arising from my participation (including claims arising from the negligence of WNY Food Web, Inc. or its directors, officers, agents, or employees).'
  ];

  constructor(
    formHelperService: FormHelperService,
    private _activatedRoute: ActivatedRoute,
    private _pledgeCreateService: DonationHubPledgeCreateService
  ) {
    super(() => new DonationHubDonateForm(), formHelperService, true);
  }

  ngOnInit() {}

  donate(): void {
    if (this.formGroup.checkValidity()) {
      const donationHubId: number = parseInt(this._activatedRoute.snapshot.paramMap.get('id'), 10);
      this._pledgeCreateService.createDonationPledge(this.formGroup.value, donationHubId).subscribe(() => {});
    }
  }
}
