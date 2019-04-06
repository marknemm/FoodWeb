import { Component, OnInit, Input, Optional, OnDestroy, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { Validators, FormGroup, FormGroupDirective, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormHelperService } from '../../services/form-helper/form-helper.service';
import { ConstantsService } from '../../services/constants/constants.service';
import { Validation } from '../../../../../shared/src/constants/validation';
import { Donation } from '../../../../../shared/src/interfaces/donation/donation';

@Component({
  selector: 'food-web-donation-form',
  templateUrl: './donation-form.component.html',
  styleUrls: ['./donation-form.component.scss']
})
export class DonationFormComponent implements OnInit, OnChanges, OnDestroy {

  readonly document: Document = document;

  @Input() formGroup: FormGroup;
  @Input() formGroupName: string;
  @Input() donation: Donation;

  private _destroy$ = new Subject();

  constructor(
    public constantsService: ConstantsService,
    private _formHelper: FormHelperService,
    @Optional() private _formGroupDirective: FormGroupDirective
  ) {}

  get donationUpdate(): Partial<Donation> {
    const donationUpdate: any = this.formGroup.getRawValue();
    if (donationUpdate.donationType === 'Other') {
      donationUpdate.donationType = donationUpdate.otherDonationType;
    }
    delete donationUpdate.otherDonationType;
    return donationUpdate;
  }

  ngOnInit() {
    this.formGroup = this._formHelper.deriveFormGroup(this.formGroup, this.formGroupName, this._formGroupDirective);
    this._formHelper.addMissingControls(
      this.formGroup,
      {
        donorFirstName: ['', Validators.required],
        donorLastName: ['', Validators.required],
        donationType: [null, Validators.required],
        otherDonationType: [null, Validators.required],
        description: ['', Validators.required],
        estimatedValue: [null, [Validators.required, Validators.min(0), Validators.pattern(Validation.MONEY_REGEX)]]
      }
    );
    this.formGroup.get('otherDonationType').disable();
    if (this.formGroupName && this._formGroupDirective.form) {
      this._formGroupDirective.form.setControl(this.formGroupName, this.formGroup);
    }
    this._listenForDonationTypeUpdate();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.donation && this.donation) {
      setTimeout(this._refreshDonationFormValue.bind(this));
    }
  }

  private _refreshDonationFormValue(): void {
    this.formGroup.reset();
    this.formGroup.patchValue(this.donation);
    if (this.constantsService.DONATION_TYPES.indexOf(this.donation.donationType) < 0) {
      const donationTypeCtrl = <FormControl>this.formGroup.get('donationType');
      this.formGroup.get('otherDonationType').setValue(this.donation.donationType);
      donationTypeCtrl.setValue('Other');
      this._updateOtherDonationTypeState(donationTypeCtrl.value);
    }
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

  private _listenForDonationTypeUpdate(): void {
    this.formGroup.get('donationType').valueChanges.pipe(takeUntil(this._destroy$)).subscribe(
      this._updateOtherDonationTypeState.bind(this)
    );
  }

  private _updateOtherDonationTypeState(donationType: string): void {
    const otherDonationTypeCtrl = <FormControl>this.formGroup.get('otherDonationType');
    (donationType === 'Other')
      ? otherDonationTypeCtrl.enable({ emitEvent: false })
      : otherDonationTypeCtrl.disable({ emitEvent: false });
  }

}
