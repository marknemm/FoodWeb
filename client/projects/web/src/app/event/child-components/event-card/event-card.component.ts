import { Component, OnInit, Input, OnChanges, SimpleChanges, Inject } from '@angular/core';

import { SessionService } from '~web/session/session.service';
import { MapService } from '~web/map/map.service';
import { EventRegistrationForm } from '~web/event-registration.form';
import { EventRegistrationService } from '~web/event-registration/event-registration.service';

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

  formGroup: EventRegistrationForm;

  private _directionsHref: string;
  private _signupComplete = false;

  constructor(
    public eventRegistrationService: EventRegistrationService,
    @Inject('Window') public window: Window,
    private _sessionService: SessionService,
    private _mapService: MapService
  ) {}

  get directionsHref(): string {
    return this._directionsHref;
  }

  get signupComplete(): boolean {
    return this._signupComplete;
  }

  ngOnInit() {
    this.formGroup = new EventRegistrationForm(this._sessionService);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.location) {
      this._directionsHref = this._mapService.genDirectionHrefEstimate(this.location);
      this._mapService.genDirectionHref(this.location).subscribe(
        (directionsHref: string) => this._directionsHref = directionsHref
      )
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
