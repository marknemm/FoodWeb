import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAppShellComponent } from '~admin/admin-app-shell/admin-app-shell/admin-app-shell.component';
import { AdminConsoleComponent } from '~admin/components/admin-console/admin-console.component';
import { BootstrapService } from '~admin/bootstrap/bootstrap/bootstrap.service';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'console' },
  { path: 'login', pathMatch: 'full', redirectTo: 'bootstrap/login' },
  { path: 'bootstrap', loadChildren: () => import('~admin/bootstrap/bootstrap.module').then(mod => mod.BootstrapModule) },
  {
    path: '',
    component: AdminAppShellComponent,
    canActivate: [BootstrapService],
    children: [
      { path: 'account', loadChildren: () => import('~web/account/account.module').then(mod => mod.AccountModule) },
      { path: 'console', component: AdminConsoleComponent },
      { path: 'delivery', loadChildren: () => import('~web/delivery/delivery.module').then(mod => mod.DeliveryModule) },
      { path: 'donation', loadChildren: () => import('~web/donation/donation.module').then(mod => mod.DonationModule) },
      { path: 'donor', loadChildren: () => import('~web/donor/donor.module').then(mod => mod.DonorModule) },
      { path: 'event', loadChildren: () => import('~admin/admin-event/admin-event.module').then(mod => mod.AdminEventModule) }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
