import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '~web/session/services/auth-guard/auth-guard.service';
import { DonationHubCreateComponent } from './components/donation-hub-create/donation-hub-create.component';
import { DonationHubEditComponent } from './components/donation-hub-edit/donation-hub-edit.component';
import { DonationHubListComponent } from './components/donation-hub-list/donation-hub-list.component';
import { DonationHubPledgeCreateComponent } from './components/donation-hub-pledge-create/donation-hub-pledge-create.component';
import { DonationHubPledgeEditComponent } from './components/donation-hub-pledge-edit/donation-hub-pledge-edit.component';
import { DonationHubPledgeListComponent } from './components/donation-hub-pledge-list/donation-hub-pledge-list.component';
import { DonationHubPledgeComponent } from './components/donation-hub-pledge/donation-hub-pledge.component';
import { DonationHubPortalComponent } from './components/donation-hub-portal/donation-hub-portal.component';
import { DonationHubComponent } from './components/donation-hub/donation-hub.component';

const routes: Routes = [
  { path: 'portal', component: DonationHubPortalComponent },
  { path: 'create', component: DonationHubCreateComponent, canActivate: [AuthGuardService] },
  { path: 'list', children: [
    { path: '', component: DonationHubListComponent },
    { path: 'my', component: DonationHubListComponent, canActivate: [AuthGuardService] }
  ]},
  { path: ':id', children: [
    { path: '', component: DonationHubComponent },
    { path: 'edit', component: DonationHubEditComponent, canActivate: [AuthGuardService] },
    { path: 'pledge/create', component: DonationHubPledgeCreateComponent, canActivate: [AuthGuardService] }
  ]},
  { path: 'pledge', children: [
    { path: 'list', children: [
      { path: '', component: DonationHubPledgeListComponent },
      { path: 'my', component: DonationHubPledgeListComponent, canActivate: [AuthGuardService] }
    ]},
    { path: ':id', children: [
      { path: '', component: DonationHubPledgeComponent },
      { path: 'edit', component: DonationHubPledgeEditComponent, canActivate: [AuthGuardService] }
    ]}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonationHubRoutingModule {}
