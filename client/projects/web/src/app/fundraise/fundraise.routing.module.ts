import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FundraiseComponent } from './components/fundraise/fundraise.component';

const routes: Routes = [
  { path: '', component: FundraiseComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FundraiseRoutingModule {}
