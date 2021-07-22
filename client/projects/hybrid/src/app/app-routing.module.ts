import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BootstrapService } from '~hybrid/bootstrap/services/bootstrap/bootstrap.service';
import { ShellComponent } from '~hybrid/shell/components/shell/shell.component';
import { HomeComponent } from '~web/home/components/home/home.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  // Redirect web login/signup to app routes.
  { path: 'login', pathMatch: 'full', redirectTo: 'bootstrap/login' },
  { path: 'signup', pathMatch: 'full', redirectTo: 'bootstrap/signup' },
  { path: 'signup/:accountType', redirectTo: 'bootstrap/signup/:accountType' },
  { path: 'bootstrap', loadChildren: () => import('./bootstrap/bootstrap.module').then(mod => mod.BootstrapModule) },
  {
    path: '',
    component: ShellComponent,
    canActivate: [BootstrapService],
    children: [
      { path: 'about', loadChildren: () => import ('~web/about/about.module').then(mod => mod.AboutModule) },
      { path: 'account', loadChildren: () => import('~web/account/account.module').then(mod => mod.AccountModule) },
      { path: 'delivery', loadChildren: () => import('~web/delivery/delivery.module').then(mod => mod.DeliveryModule) },
      { path: 'donation', loadChildren: () => import('~web/donation/donation.module').then(mod => mod.DonationModule) },
      { path: 'donation-hub', loadChildren: () => import('~web/donation-hub/donation-hub.module').then(mod => mod.DonationHubModule) },
      { path: 'donor', loadChildren: () => import('~web/donor/donor.module').then(mod => mod.DonorModule) },
      { path: 'event', loadChildren: () => import('~web/event/event.module').then(mod => mod.EventModule) },
      { path: 'home', component: HomeComponent },
      { path: 'home/:login', component: HomeComponent },
      { path: 'notification', loadChildren: () => import('~web/notification/notification.module').then(mod => mod.NotificationModule) },
      { path: 'password', loadChildren: () => import('~web/password/password.module').then(mod => mod.PasswordModule) },
      { path: 'signup', loadChildren: () => import('~web/signup/signup.module').then(mod => mod.SignupModule) }
    ]
  },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
