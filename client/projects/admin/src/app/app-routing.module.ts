import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminBootstrapService } from './admin-bootstrap/services/admin-bootstrap/admin-bootstrap.service';
import { AdminConsoleComponent } from './admin-console/components/admin-console/admin-console.component';
import { AdminShellComponent } from './admin-shell/components/admin-shell/admin-shell.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'console' },
  { path: 'login', pathMatch: 'full', redirectTo: 'bootstrap/login' },
  { path: 'bootstrap', loadChildren: () => import('src/app/admin-bootstrap/admin-bootstrap.module').then(mod => mod.AdminBootstrapModule) },
  {
    path: '',
    component: AdminShellComponent,
    canActivate: [AdminBootstrapService],
    children: [
      { path: 'account', loadChildren: () => import('~admin/admin-account/admin-account.module').then(mod => mod.AdminAccountModule) },
      { path: 'console', component: AdminConsoleComponent },
      { path: 'delivery', loadChildren: () => import('~admin/admin-delivery/admin-delivery.module').then(mod => mod.AdminDeliveryModule) },
      { path: 'developer', loadChildren: () => import('~admin/developer/developer.module').then(mod => mod.DeveloperModule) },
      { path: 'donation', loadChildren: () => import('~admin/admin-donation/admin-donation.module').then(mod => mod.AdminDonationModule) },
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
