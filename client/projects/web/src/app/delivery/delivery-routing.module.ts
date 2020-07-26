import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGaurdService } from '~web/session/services/auth-gaurd/auth-gaurd.service';
import { DeliveriesComponent } from './components/deliveries/deliveries.component';
import { DeliveryDetailsComponent } from './components/delivery-details/delivery-details.component';

const routes: Routes = [
  { path: 'details/:id', component: DeliveryDetailsComponent },
  { path: 'list', component: DeliveriesComponent },
  { path: 'list/my', component: DeliveriesComponent, canActivate: [AuthGaurdService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryRoutingModule {}
