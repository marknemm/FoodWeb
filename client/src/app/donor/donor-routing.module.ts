import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DonateComponent } from './components/donate/donate.component';
import { AuthGaurdService } from '../session/services/auth-gaurd/auth-gaurd.service';

const routes: Routes = [
  { path: 'donate', component: DonateComponent, canActivate: [AuthGaurdService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonorRoutingModule {}
