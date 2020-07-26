import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { FeaturedEvent, FeaturedEventsService } from '~web/event/services/featured-events/featured-events.service';
import { LoginDialogComponent } from '~web/session/components/login-dialog/login-dialog.component';
import { SessionService } from '~web/session/services/session/session.service';

@Component({
  selector: 'foodweb-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private _featuredEvent: FeaturedEvent;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _featuredEventsService: FeaturedEventsService,
    private _matDialog: MatDialog,
    private _sessionService: SessionService
  ) {}

  get featuredEvent(): FeaturedEvent {
    return this._featuredEvent;
  }

  ngOnInit() {
    if (!!this._activatedRoute.snapshot.params['login']) {
      // Logout if directed to '/home/login' with an impersonationToken query param present.
      if (!!this._activatedRoute.snapshot.queryParams['impersonationToken']) {
        this._sessionService.logout(false);
      }
      LoginDialogComponent.openIfNotLoggedIn(this._sessionService, this._matDialog);
    }
    this._featuredEventsService.getNextFeaturedEvent().subscribe(
      (featuredEvent: FeaturedEvent) => this._featuredEvent = featuredEvent
    );
  }

}
