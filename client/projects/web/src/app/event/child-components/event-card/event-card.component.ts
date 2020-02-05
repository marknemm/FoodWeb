import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { EventRegistrationForm } from '~web/event/event-registration.form';
import { EventRegistrationService } from '~web/event/event-registration/event-registration.service';
import { FeaturedEvent } from '~web/event/featured-event';
import { MapAppLinkService } from '~web/map/map-app-link/map-app-link.service';
import { SessionService } from '~web/session/session/session.service';

@Component({
  selector: 'food-web-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  providers: [EventRegistrationService]
})
export class EventCardComponent implements OnInit, OnChanges {

  @Input() featuredEvent: FeaturedEvent;
  @Input() linkToEventsPage = false;

  formGroup: EventRegistrationForm;

  private _directionsHref: string;
  private _signupComplete = false;
  private _signupPanelShouldGlow = false;

  constructor(
    public eventRegistrationService: EventRegistrationService,
    @Inject('Window') public window: Window,
    private _sessionService: SessionService,
    private _mapAppLinkService: MapAppLinkService
  ) {}

  get directionsHref(): string {
    return this._directionsHref;
  }

  get signupPanelShouldGlow(): boolean {
    return this._signupPanelShouldGlow;
  }

  get signupComplete(): boolean {
    return this._signupComplete;
  }

  ngOnInit() {
    this.formGroup = new EventRegistrationForm(this._sessionService);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.featuredEvent && this.featuredEvent) {
      setTimeout(() => {
        this._signupPanelShouldGlow = (localStorage.getItem(`food-web-event-selected-${this.featuredEvent.showUntil.getTime()}`) !== 'true');
        this._directionsHref = this._mapAppLinkService.genDirectionHref(['My+Location', this.featuredEvent.location]);
        this.featuredEvent.location = this.featuredEvent.location.replace(/<[^>]*>/g, '').replace(',', '<br>');
      });
    }
  }

  onSignupPanelExpanded(): void {
    this._signupPanelShouldGlow = false;
    localStorage.setItem(`food-web-event-selected-${this.featuredEvent.showUntil.getTime()}`, 'true');
  }

  submitSignup(): void {
    if (this.formGroup.valid) {
      const eventDateTime = `${this.featuredEvent.date} ${this.featuredEvent.time}`;
      this.eventRegistrationService.signup(this.featuredEvent.time, eventDateTime, this.formGroup.value).subscribe(
        () => this._signupComplete = true
      )
    }
  }

}
