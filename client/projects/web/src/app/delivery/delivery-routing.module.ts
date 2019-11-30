import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeliveriesComponent } from '~web/delivery/deliveries/deliveries.component';
import { AuthGaurdService } from '~web/session/auth-gaurd/auth-gaurd.service';

const routes: Routes = [
  { path: 'list', component: DeliveriesComponent },
  { path: 'list/my', component: DeliveriesComponent, canActivate: [AuthGaurdService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryRoutingModule {}
