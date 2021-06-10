import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HybridBootstrapService } from '~hybrid/hybrid-bootstrap/services/hybrid-bootstrap/hybrid-bootstrap.service';
import { AboutComponent } from '~web/about/components/about/about.component';
import { HomeComponent } from '~web/home/components/home/home.component';
import { ShellComponent } from '~web/shell/components/shell/shell.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  // Redirect web login/signup to app routes.
  { path: 'login', pathMatch: 'full', redirectTo: 'bootstrap/login' },
  { path: 'signup', pathMatch: 'full', redirectTo: 'bootstrap/signup' },
  { path: 'signup/:accountType', redirectTo: 'bootstrap/signup/:accountType' },
  { path: 'bootstrap', loadChildren: () => import('./hybrid-bootstrap/hybrid-bootstrap.module').then(mod => mod.HybridBootstrapModule) },
  {
    path: '',
    component: ShellComponent,
    canActivate: [HybridBootstrapService],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'home/:login', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'account', loadChildren: () => import('~web/account/account.module').then(mod => mod.AccountModule) },
      { path: 'password', loadChildren: () => import('~web/password/password.module').then(mod => mod.PasswordModule) },
      { path: 'donation', loadChildren: () => import('~web/donation/donation.module').then(mod => mod.DonationModule) },
      { path: 'donor', loadChildren: () => import('~web/donor/donor.module').then(mod => mod.DonorModule) },
      { path: 'delivery', loadChildren: () => import('~web/delivery/delivery.module').then(mod => mod.DeliveryModule) },
      { path: 'notification', loadChildren: () => import('~web/notification/notification.module').then(mod => mod.NotificationModule) },
      { path: 'event', loadChildren: () => import('~web/event/event.module').then(mod => mod.EventModule) }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
