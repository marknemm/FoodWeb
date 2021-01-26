import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGaurdService } from '~web/session/services/auth-gaurd/auth-gaurd.service';
import { DonationHubCreateComponent } from './components/donation-hub-create/donation-hub-create.component';
import { DonationHubEditComponent } from './components/donation-hub-edit/donation-hub-edit.component';
import { DonationHubListComponent } from './components/donation-hub-list/donation-hub-list.component';
import { DonationHubPledgeCreateComponent } from './components/donation-hub-pledge-create/donation-hub-pledge-create.component';
import { DonationHubPledgeEditComponent } from './components/donation-hub-pledge-edit/donation-hub-pledge-edit.component';
import { DonationHubPledgeComponent } from './components/donation-hub-pledge/donation-hub-pledge.component';
import { DonationHubComponent } from './components/donation-hub/donation-hub.component';

const routes: Routes = [
  { path: 'create', component: DonationHubCreateComponent, canActivate: [AuthGaurdService] },
  { path: 'list', component: DonationHubListComponent },
  { path: 'my', component: DonationHubListComponent },
  { path: ':id', children: [
    { path: '', component: DonationHubComponent },
    { path: 'edit', component: DonationHubEditComponent, canActivate: [AuthGaurdService] },
    { path: 'pledge/create', component: DonationHubPledgeCreateComponent, canActivate: [AuthGaurdService] }
  ]},
  { path: 'pledge/:id', children: [
    { path: '', component: DonationHubPledgeComponent },
    { path: 'edit', component: DonationHubPledgeEditComponent, canActivate: [AuthGaurdService] }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonationHubRoutingModule {}
