import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventReadService, FeaturedEvent } from '~web/event/services/event-read/event-read.service';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';
import { SessionService } from '~web/session/services/session/session.service';
import { ShellService } from '~web/shell/services/shell/shell.service';

@Component({
  selector: 'foodweb-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  readonly nowDate = new Date();

  private _event: FeaturedEvent;

  constructor(
    public sessionService: SessionService,
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthenticationService,
    private _eventReadService: EventReadService,
    shellService: ShellService,
  ) {
    shellService.footerAttributions = [
      '<span class="desktop">Image by</span> <a href="https://www.freepik.com/free-photo/copy-space-ingredients-noodles_8361833.htm#query=food%20background&position=23&from_view=search&track=ais#position=23&query=food%20background" target="_blank">Freepik</a>'
    ];
  }

  get event(): FeaturedEvent {
    return this._event;
  }

  get donationHubFeatureVisible(): boolean {
    return (!this.sessionService.isDonor && !this.sessionService.isReceiver);
  }

  ngOnInit(): void {
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
