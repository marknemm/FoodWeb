import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppShellComponent } from '~web/app-shell/app-shell.component';
import { HomeComponent } from '~web/home/home.component';
import { AboutComponent } from '~web/about/about.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  // Redirects from old app structure.
  { path: 'notifications', pathMatch: 'full', redirectTo: 'notification/list/my' },
  { path: 'signup-verification', pathMatch: 'full', redirectTo: 'signup/verification' },
  { path: 'donation-details/:id', pathMatch: 'full', redirectTo: 'donation/details/:id' },
  {
    path: '',
    component: AppShellComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'home/:login', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'signup', loadChildren: () => import('~web/signup/signup.module').then(mod => mod.SignupModule) },
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
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}