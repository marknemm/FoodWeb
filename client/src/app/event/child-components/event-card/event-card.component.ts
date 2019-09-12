import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SessionService } from '../../../session/services/session/session.service';
import { EventRegistrationService } from '../../../event/services/event-registration/event-registration.service';
import { MapService } from '../../../shared/services/map/map.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Validation } from '../../../../../../shared/src/constants/validation';
import { Account } from '../../../../../../shared/src/interfaces/account/account';
import { AccountHelper } from '../../../../../../shared/src/helpers/account-helper';

@Component({
  selector: 'food-web-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  providers: [EventRegistrationService]
})
export class EventCardComponent implements OnInit, OnChanges {

  @Input() eventTitle: string;
  @Input() date: string;
  @Input() time: string;
  @Input() eventDay: string | number;
  @Input() location: string;
  @Input() signupTitle: string;
  @Input() glowLocalStorageVar: string;

  readonly window: Window = window;

  formGroup: FormGroup;

  private _locationHref: string;
  private _signupComplete = false;

  constructor(
    public eventRegistrationService: EventRegistrationService,
    private _formBuilder: FormBuilder,
    private _sessionService: SessionService,
    private _mapService: MapService,
    private _accountHelper: AccountHelper
  ) {}

  get locationHref(): string {
    return this._locationHref;
  }

  get signupComplete(): boolean {
    return this._signupComplete;
  }

  ngOnInit() {
    this._initForm();
    this._setFormValuesIfCan();
  }

  private _initForm(): void {
    this.formGroup = this._formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(Validation.PHONE_REGEX)]]
    });
  }

  private _setFormValuesIfCan(): void {
    if (this._sessionService.loggedIn && this._sessionService.isVolunteer) {
      const account: Account = this._sessionService.account;
      this.formGroup.get('fullName').setValue(this._accountHelper.accountName(account));
      this.formGroup.get('email').setValue(account.contactInfo.email);
      this.formGroup.get('phoneNumber').setValue(account.contactInfo.phoneNumber);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.location) {
      this._locationHref = this._mapService.genDirectionHref(this.location);
      this.location = this.location.replace(/<[^>]*>/g, '').replace(',', '<br>');
    }
  }

  submitSignup(): void {
    if (this.formGroup.valid) {
      this.eventRegistrationService.signup(this.eventTitle, `${this.date} ${this.time}`, this.formGroup.value).subscribe(
        () => this._signupComplete = true
      )
    }
  }

}
