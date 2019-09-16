import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EventRegistrationForm } from '../../forms/event-registration.form';
import { SessionService } from '../../../session/services/session/session.service';
import { EventRegistrationService } from '../../../event/services/event-registration/event-registration.service';
import { MapService } from '../../../shared/services/map/map.service';
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

  formGroup: EventRegistrationForm;

  private _locationHref: string;
  private _signupComplete = false;

  constructor(
    public eventRegistrationService: EventRegistrationService,
    private _sessionService: SessionService,
    private _mapService: MapService
  ) {}

  get locationHref(): string {
    return this._locationHref;
  }

  get signupComplete(): boolean {
    return this._signupComplete;
  }

  ngOnInit() {
    this.formGroup = new EventRegistrationForm(this._sessionService);
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
