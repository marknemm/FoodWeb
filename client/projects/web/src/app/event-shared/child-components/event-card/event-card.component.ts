import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FeaturedEvent } from '~shared';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { EventRegistrationForm } from '~web/event/forms/event-registration.form';
import { RegisterEventService } from '~web/event/services/register-event/register-event.service';
import { MapAppLinkService } from '~web/map/services/map-app-link/map-app-link.service';
import { SessionService } from '~web/session/services/session/session.service';

@Component({
  selector: 'foodweb-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  providers: [RegisterEventService]
})
export class EventCardComponent implements OnInit, OnChanges {

  @Input() featuredEvent: FeaturedEvent;
  @Input() linkToEventsPage = false;

  formGroup: EventRegistrationForm;

  private _directionsHref: string;
  private _endTime: Date;
  private _signupComplete = false;
  private _signupPanelShouldGlow = false;

  constructor(
    public eventRegistrationService: RegisterEventService,
    public window: Window,
    private _dateTimeService: DateTimeService,
    private _mapAppLinkService: MapAppLinkService,
    private _sessionService: SessionService,
  ) { }

  get directionsHref(): string {
    return this._directionsHref;
  }

  get endTime(): Date {
    return this._endTime;
  }

  get signupComplete(): boolean {
    return this._signupComplete;
  }

  get signupPanelShouldGlow(): boolean {
    return this._signupPanelShouldGlow;
  }

  ngOnInit() {
    this.formGroup = new EventRegistrationForm(this._sessionService);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.featuredEvent && this.featuredEvent) {
      setTimeout(() => {
        this._signupPanelShouldGlow = (localStorage.getItem(`foodweb-event-selected-${this.featuredEvent.showUntil?.getTime()}`) !== 'true');
        const fullAddress = `${this.featuredEvent.streetAddress}, ${this.featuredEvent.city} `
          + `${this.featuredEvent.stateProvince}, ${this.featuredEvent.postalCode}`;
        this._directionsHref = this._mapAppLinkService.genDirectionHref(['My+Location', fullAddress]);
        this._endTime = (this.featuredEvent.durationMins)
          ? this._dateTimeService.addMinutes(this.featuredEvent.date, this.featuredEvent.durationMins)
          : null;
      });
    }
  }

  onSignupPanelExpanded(): void {
    this._signupPanelShouldGlow = false;
    localStorage.setItem(`foodweb-event-selected-${this.featuredEvent.showUntil?.getTime()}`, 'true');
  }

  submitSignup(): void {
    if (this.formGroup.valid) {
      this.eventRegistrationService.register(this.featuredEvent, this.formGroup.value).subscribe(
        () => this._signupComplete = true
      );
    }
  }

}
