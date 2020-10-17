import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FundraiseComponent } from './components/fundraise/fundraise.component';
import { FundraiseRoutingModule } from './fundraise.routing.module';

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
