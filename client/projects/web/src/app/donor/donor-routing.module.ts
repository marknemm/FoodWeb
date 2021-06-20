import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DonateComponent } from './components/donate/donate.component';
import { DonationEditComponent } from './components/donation-edit/donation-edit.component';
import { AuthGaurdService } from '~web/session/services/auth-gaurd/auth-gaurd.service';

const routes: Routes = [
  { path: 'donate', component: DonateComponent, canActivate: [AuthGaurdService] },
  { path: 'edit-donation/:id', component: DonationEditComponent, canActivate: [AuthGaurdService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonorRoutingModule {}
