import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGaurdService } from '~web/auth-gaurd/auth-gaurd.service';

import { DonateComponent } from '~web/donate/donate.component';

const routes: Routes = [
  { path: 'donate', component: DonateComponent, canActivate: [AuthGaurdService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonorRoutingModule {}
