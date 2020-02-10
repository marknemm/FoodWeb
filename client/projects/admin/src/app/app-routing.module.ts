import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAppShellComponent } from '~admin/admin-app-shell/admin-app-shell/admin-app-shell.component';
import { AdminConsoleComponent } from './components/admin-console/admin-console.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'console' },
  {
    path: '',
    component: AdminAppShellComponent,
    children: [
      { path: 'account', loadChildren: () => import('~web/account/account.module').then(mod => mod.AccountModule) },
      { path: 'delivery', loadChildren: () => import('~web/delivery/delivery.module').then(mod => mod.DeliveryModule) },
      { path: 'donation', loadChildren: () => import('~web/donation/donation.module').then(mod => mod.DonationModule) },
      { path: 'donor', loadChildren: () => import('~web/donor/donor.module').then(mod => mod.DonorModule) },
      { path: 'event', loadChildren: () => import('~admin/admin-event/admin-event.module').then(mod => mod.AdminEventModule) },
      { path: 'console', component: AdminConsoleComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
