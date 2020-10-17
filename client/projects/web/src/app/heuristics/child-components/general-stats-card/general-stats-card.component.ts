import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GeneralStats, GeneralStatsService } from '~web/heuristics/services/heuristics/general-stats.service';

@Component({
  selector: 'foodweb-general-stats-card',
  templateUrl: './general-stats-card.component.html',
  styleUrls: ['./general-stats-card.component.scss']
})
export class GeneralStatsCardComponent implements OnInit, OnDestroy {

  private _generalStats: GeneralStats;
  private _destory$ = new Subject();

  constructor(
    public generalStatsService: GeneralStatsService
  ) {}

  get generalStats(): GeneralStats {
    return this._generalStats;
  }

  get showStatValues(): boolean {
    return (!this.generalStatsService.loading || !!this.generalStats);
  }

  ngOnInit() {
    // Retrieve latest stats every 30 seconds.
    this.generalStatsService.watchGeneralStats().pipe(
      takeUntil(this._destory$)
    ).subscribe((generalStats: GeneralStats) => this._generalStats = generalStats);
  }

  ngOnDestroy() {
    this._destory$.next();
  }

}
