import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGaurdService } from '~web/session';

import { DeliveriesComponent } from '~web/delivery';

const routes: Routes = [
  { path: 'list', component: DeliveriesComponent },
  { path: 'list/my', component: DeliveriesComponent, canActivate: [AuthGaurdService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryRoutingModule {}
