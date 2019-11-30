import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DonateComponent } from '~web/donor/donate/donate.component';
import { AuthGaurdService } from '~web/session/auth-gaurd/auth-gaurd.service';

const routes: Routes = [
  { path: 'donate', component: DonateComponent, canActivate: [AuthGaurdService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonorRoutingModule {}
