import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FeaturedEvent } from '~shared';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { EventRegistrationForm, EventRegistrationFormAdapter } from '~web/event/services/event-registration-form-adapter/event-registration-form-adapter.service';
import { EventRegistrationService } from '~web/event/services/event-registration/event-registration.service';
import { MapAppLinkService } from '~web/map/services/map-app-link/map-app-link.service';
import { SessionService } from '~web/session/services/session/session.service';

@Component({
  selector: 'foodweb-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  providers: [EventRegistrationService]
})
export class EventCardComponent implements OnChanges {

  @Input() event: FeaturedEvent;
  @Input() linkToEventsPage = false;

  readonly formGroup: EventRegistrationForm = this._eventRegistrationFormAdapter.toForm({ account: this._sessionService.account });

  private _directionsHref: string;
  private _endTime: Date;
  private _signupComplete = false;
  private _signupPanelShouldGlow = false;

  constructor(
    private _dateTimeService: DateTimeService,
    private _eventRegistrationFormAdapter: EventRegistrationFormAdapter,
    private _eventRegistrationService: EventRegistrationService,
    private _mapAppLinkService: MapAppLinkService,
    private _sessionService: SessionService,
  ) {}

  get directionsHref(): string {
    return this._directionsHref;
  }

  get endTime(): Date {
    return this._endTime;
  }

  get loading(): boolean {
    return this._eventRegistrationService.loading;
  }

  get signupComplete(): boolean {
    return this._signupComplete;
  }

  get signupPanelShouldGlow(): boolean {
    return this._signupPanelShouldGlow;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.event && this.event) {
      setTimeout(() => {
        this._signupPanelShouldGlow = (localStorage.getItem(`foodweb-event-selected-${this.event.showUntil?.getTime()}`) !== 'true');
        const fullAddress = `${this.event.streetAddress}, ${this.event.city} `
          + `${this.event.stateProvince}, ${this.event.postalCode}`;
        this._directionsHref = this._mapAppLinkService.genDirectionHref(['My+Location', fullAddress]);
        this._endTime = (this.event.durationMins)
          ? this._dateTimeService.addMinutes(this.event.date, this.event.durationMins)
          : null;
      });
    }
  }

  onSignupPanelExpanded(): void {
    this._signupPanelShouldGlow = false;
    localStorage.setItem(`foodweb-event-selected-${this.event.showUntil?.getTime()}`, 'true');
  }

  submitSignup(): void {
    if (this.formGroup.valid) {
      this._eventRegistrationService.register(this.event, this.formGroup.value).subscribe(
        () => this._signupComplete = true
      );
    }
  }

}
