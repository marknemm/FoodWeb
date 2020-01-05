import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FundraiseRoutingModule } from '~web/fundraise/fundraise.routing.module';
import { FundraiseComponent } from '~web/fundraise/fundraise/fundraise.component';

@NgModule({
  declarations: [
    FundraiseComponent
  ],
  imports: [
    CommonModule,
    FundraiseRoutingModule
  ]
})
export class FundraiseModule {}
