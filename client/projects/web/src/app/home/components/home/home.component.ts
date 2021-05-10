import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { FeaturedEvent, FeaturedEventsService } from '~web/event/services/featured-events/featured-events.service';
import { LoginDialogComponent } from '~web/session/components/login-dialog/login-dialog.component';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';
import { SessionService } from '~web/session/services/session/session.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GeneralStats, GeneralStatsService } from '~web/heuristics/services/heuristics/general-stats.service';
import { DonationReadService } from '~web/donation/services/donation-read/donation-read.service';
import { Donation, DonationReadRequest, ListResponse } from '~shared';

@Component({
  selector: 'foodweb-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private _featuredEvent: FeaturedEvent;
  private _generalStats: GeneralStats;
  private _destory$ = new Subject();
  private _donations: Donation[] = [];

  constructor(
    public sessionService: SessionService,
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthenticationService,
    private _featuredEventsService: FeaturedEventsService,
    private _matDialog: MatDialog,
    public generalStatsService: GeneralStatsService,
    private _donationReadService: DonationReadService
  ) {}

  get donations(): Donation[] {
    return this._donations;
  }

  get featuredEvent(): FeaturedEvent {
    return this._featuredEvent;
  }

  get donationHubFeatureVisible(): boolean {
    return (!this.sessionService.isDonor && !this.sessionService.isReceiver);
  }

  get generalStats(): GeneralStats {
    return this._generalStats ?? {
      totalDonations: 0,
      totalMeals: 0
    };
  }

  get showStatValues(): boolean {
    return (!this.generalStatsService.loading || !!this.generalStats);
  }

  ngOnInit() {
    if (!!this._activatedRoute.snapshot.params['login']) {
      // Logout if directed to '/home/login' with an impersonationToken query param present.
      if (!!this._activatedRoute.snapshot.queryParams['impersonationToken']) {
        this._authService.logout();
      }
      this.openLoginDialog();
    }
    this._featuredEventsService.getNextFeaturedEvent().subscribe(
      (featuredEvent: FeaturedEvent) => this._featuredEvent = featuredEvent
    );

    // Retrieve latest stats every 30 seconds.
    this.generalStatsService.watchGeneralStats().pipe(
      takeUntil(this._destory$)
    ).subscribe((generalStats: GeneralStats) => this._generalStats = generalStats);

    const request : DonationReadRequest = {
      page: 1,
      limit: 3,
      upcoming: true
    };

    this._donationReadService.getDonations(request).subscribe((response: ListResponse<Donation>) => {
      this._donations = response.list;
    });
  }

  openLoginDialog(): void {
    LoginDialogComponent.openIfNotLoggedIn(this.sessionService, this._matDialog);
  }

  ngOnDestroy() {
    this._destory$.next();
  }

  viewAccount(id: number) :string {
    return `/donation/details/${id}`;
  }

}
