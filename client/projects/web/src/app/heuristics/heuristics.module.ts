import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GeneralStatsCardComponent } from '~web/heuristics/general-stats-card/general-stats-card.component';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';

@NgModule({
  declarations: [
    GeneralStatsCardComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule
  ],
  exports: [
    GeneralStatsCardComponent
  ]
})
export class HeuristicsModule {}
