import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGaurdService } from '~web/session/services/auth-gaurd/auth-gaurd.service';
import { DonationHubDetailsComponent } from './components/donation-hub-details/donation-hub-details.component';
import { DonationHubDonateComponent } from './components/donation-hub-donate/donation-hub-donate.component';
import { DonationHubEditComponent } from './components/donation-hub-edit/donation-hub-edit.component';
import { DonationHubRegistrationComponent } from './components/donation-hub-registration/donation-hub-registration.component';
import { DonationHubsComponent } from './components/donation-hubs/donation-hubs.component';

const routes: Routes = [
  { path: 'details/:id', component: DonationHubDetailsComponent },
  { path: 'donate/:id', component: DonationHubDonateComponent, canActivate: [AuthGaurdService] },
  { path: 'edit/:id', component: DonationHubEditComponent, canActivate: [AuthGaurdService] },
  { path: 'list', component: DonationHubsComponent },
  { path: 'register', component: DonationHubRegistrationComponent, canActivate: [AuthGaurdService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonationHubRoutingModule {}
