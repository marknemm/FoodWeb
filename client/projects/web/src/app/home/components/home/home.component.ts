import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventReadService, FeaturedEvent } from '~web/event/services/event-read/event-read.service';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';
import { SessionService } from '~web/session/services/session/session.service';

@Component({
  selector: 'foodweb-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  readonly nowDate = new Date();
  readonly christmasDayDate = new Date('12/25/2021');

  private _event: FeaturedEvent;

  constructor(
    public sessionService: SessionService,
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthenticationService,
    private _eventReadService: EventReadService,
  ) {}

  get event(): FeaturedEvent {
    return this._event;
  }

  get donationHubFeatureVisible(): boolean {
    return (!this.sessionService.isDonor && !this.sessionService.isReceiver);
  }

  ngOnInit() {
    if (this._activatedRoute.snapshot.params['login']) {
      // Logout if directed to '/home/login' with an impersonationToken query param present.
      if (this._activatedRoute.snapshot.queryParams['impersonationToken']) {
        this._authService.logout();
      }
      this.openLoginDialog();
    }
    this._eventReadService.getNextEvent().subscribe(
      (event: FeaturedEvent) => this._event = event
    );
  }

  openLoginDialog(): void {
    this._authService.openLoginDialogIfNotLoggedIn();
  }

}
