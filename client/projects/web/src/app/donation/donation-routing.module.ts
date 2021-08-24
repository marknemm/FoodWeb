import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGaurdService } from '~web/session/services/auth-gaurd/auth-gaurd.service';
import { DonationListComponent } from './components/donation-list/donation-list.component';
import { DonationComponent } from './components/donation/donation.component';

const routes: Routes = [
  { path: 'list', component: DonationListComponent },
  { path: 'list/my', component: DonationListComponent, canActivate: [AuthGaurdService] },
  { path: ':id', component: DonationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonationRoutingModule {}
