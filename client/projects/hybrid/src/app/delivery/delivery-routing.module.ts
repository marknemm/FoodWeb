import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '~web/session/services/auth-guard/auth-guard.service';
import { DeliveryListComponent } from './components/delivery-list/delivery-list.component';
import { DeliveryPortalComponent } from './components/delivery-portal/delivery-portal.component';
import { DeliveryComponent } from './components/delivery/delivery.component';

const routes: Routes = [
  { path: '', component: DeliveryPortalComponent },
  { path: 'list', component: DeliveryListComponent },
  { path: 'list/my', component: DeliveryListComponent, canActivate: [AuthGuardService] },
  { path: ':id', component: DeliveryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryRoutingModule {}
