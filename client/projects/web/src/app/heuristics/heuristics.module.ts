import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';
import { GeneralStatsCardComponent } from './child-components/general-stats-card/general-stats-card.component';

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
