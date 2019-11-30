import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DonationDetailsComponent } from '~web/donation/donation-details/donation-details.component';
import { DonationsComponent } from '~web/donation/donations/donations.component';
import { AuthGaurdService } from '~web/session/auth-gaurd/auth-gaurd.service';

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
