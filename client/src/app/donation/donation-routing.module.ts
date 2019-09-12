import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGaurdService } from '../session/services/auth-gaurd/auth-gaurd.service';
import { DonationsComponent } from './components/donations/donations.component';
import { DonationDetailsComponent } from './components/donation-details/donation-details.component';

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
