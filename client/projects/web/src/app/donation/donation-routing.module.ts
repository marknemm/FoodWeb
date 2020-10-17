import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGaurdService } from '~web/session/services/auth-gaurd/auth-gaurd.service';
import { DonationDetailsComponent } from './components/donation-details/donation-details.component';
import { DonationsComponent } from './components/donations/donations.component';

const routes: Routes = [
  { path: 'details/:id', component: DonationDetailsComponent },
  { path: 'list', component: DonationsComponent },
  { path: 'list/my', component: DonationsComponent, canActivate: [AuthGaurdService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonationRoutingModule {}
