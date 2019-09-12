import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGaurdService } from '../session/services/auth-gaurd/auth-gaurd.service';
import { DeliveriesComponent } from './components/deliveries/deliveries.component';

const routes: Routes = [
  { path: 'list', component: DeliveriesComponent },
  { path: 'list/my', component: DeliveriesComponent, canActivate: [AuthGaurdService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryRoutingModule {}
