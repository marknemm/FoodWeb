import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGaurdService } from '~web/session/services/auth-gaurd/auth-gaurd.service';
import { DonationsComponent, DonationDetailsComponent } from '~web/donation';

const routes: Routes = [
  { path: 'list', component: DonationsComponent },
  { path: 'list/my', component: DonationsComponent, canActivate: [AuthGaurdService] },
  { path: 'details/:id', component: DonationDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonationRoutingModule {}
