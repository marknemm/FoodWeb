import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from '~web/shared/shared.module';
import { GeneralStatsCardComponent } from './child-components/general-stats-card/general-stats-card.component';

@NgModule({
  declarations: [
    GeneralStatsCardComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    SharedModule
  ],
  exports: [
    GeneralStatsCardComponent
  ]
})
export class HeuristicsModule {}
