import { Component, OnInit } from '@angular/core';
import { GeneralStats, GeneralStatsService } from '~web/heuristics/services/heuristics/general-stats.service';
import { DestroyService } from '~web/shared/services/destroy/destroy.service';

@Component({
  selector: 'foodweb-general-stats-card',
  templateUrl: './general-stats-card.component.html',
  styleUrls: ['./general-stats-card.component.scss'],
  providers: [DestroyService]
})
export class GeneralStatsCardComponent implements OnInit {

  private _generalStats: GeneralStats;

  constructor(
    public generalStatsService: GeneralStatsService,
    private _destroyService: DestroyService
  ) {}

  get generalStats(): GeneralStats {
    return this._generalStats;
  }

  get showStatValues(): boolean {
    return (!this.generalStatsService.loading || !!this.generalStats);
  }

  ngOnInit(): void {
    // Retrieve latest stats every 30 seconds.
    this.generalStatsService.watchGeneralStats().pipe(
      this._destroyService.untilDestroy()
    ).subscribe((generalStats: GeneralStats) => this._generalStats = generalStats);
  }

}
