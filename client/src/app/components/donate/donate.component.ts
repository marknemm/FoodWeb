import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DonationService, Donation } from '../../services/donation/donation.service';

@Component({
  selector: 'food-web-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss']
})
export class DonateComponent implements OnInit {

  readonly donationTypes = ['Food', 'Merchandise', 'Cash', 'Service', 'Other'];
  readonly document: Document = document;
  donateForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _donationService: DonationService
  ) {}

  ngOnInit() {
    this.donateForm = this._formBuilder.group({
      donorFirstName: ['', Validators.required],
      donorLastName: ['', Validators.required],
      donationType: [null, Validators.required],
      description: ['', Validators.required],
      estimatedValue: [null, [Validators.required, Validators.min(0)]]
    });
  }

  donate(): void {
    if (this.donateForm.valid) {
      this._donationService.createDonation(this.donateForm.getRawValue()).subscribe((donation: Donation) => {
        console.log('Donation Saved!!!');
      });
    }
  }

  canShowOtherTypeInput(): boolean {
    const donationType: string = this.donateForm.get('donationType').value;
    return (donationType != null && this.donationTypes.indexOf(donationType) < 0);
  }

}
