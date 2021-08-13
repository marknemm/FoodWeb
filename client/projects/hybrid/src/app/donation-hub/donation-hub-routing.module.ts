import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DonationHubNavigationComponent } from './components/donation-hub-navigation/donation-hub-navigation.component';

const routes: Routes = [
  { path: '', component: DonationHubNavigationComponent },
  // { path: 'create', component: DonationHubCreateComponent, canActivate: [AuthGaurdService] },
  // { path: 'list', children: [
  //   { path: '', component: DonationHubListComponent },
  //   { path: 'my', component: DonationHubListComponent, canActivate: [AuthGaurdService] }
  // ]},
  // { path: ':id', children: [
  //   { path: '', component: DonationHubComponent },
  //   { path: 'edit', component: DonationHubEditComponent, canActivate: [AuthGaurdService] },
  //   { path: 'pledge/create', component: DonationHubPledgeCreateComponent, canActivate: [AuthGaurdService] }
  // ]},
  // { path: 'pledge', children: [
  //   { path: 'list', children: [
  //     { path: '', component: DonationHubPledgeListComponent },
  //     { path: 'my', component: DonationHubPledgeListComponent, canActivate: [AuthGaurdService] }
  //   ]},
  //   { path: ':id', children: [
  //     { path: '', component: DonationHubPledgeComponent },
  //     { path: 'edit', component: DonationHubPledgeEditComponent, canActivate: [AuthGaurdService] }
  //   ]}
  // ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonationHubRoutingModule {}
