import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGaurdService } from '~web/session/services/auth-gaurd/auth-gaurd.service';
import { DonateComponent } from './components/donate/donate.component';
import { DonationEditComponent } from './components/donation-edit/donation-edit.component';
import { DonationListComponent } from './components/donation-list/donation-list.component';
import { DonationComponent } from './components/donation/donation.component';

const routes: Routes = [
  { path: 'donate', component: DonateComponent },
  { path: 'list', children: [
    { path: '', component: DonationListComponent },
    { path: 'my', component: DonationListComponent, canActivate: [AuthGaurdService] },
  ]},
  { path: ':id', children: [
    { path: '', component: DonationComponent },
    { path: 'edit', component: DonationEditComponent },
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonationRoutingModule {}
