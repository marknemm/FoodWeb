import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared.module';

import { GeneralStatsCardComponent } from '~web/general-stats-card/general-stats-card.component';

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
