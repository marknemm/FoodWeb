import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppShellComponent } from '~web/app-shell/app-shell/app-shell.component';
import { AboutComponent } from '~web/components/about/about.component';
import { HomeComponent } from '~web/components/home/home.component';

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
      { path: 'about', component: AboutComponent },
      { path: 'account', loadChildren: () => import('~web/account/account.module').then(mod => mod.AccountModule) },
      { path: 'delivery', loadChildren: () => import('~web/delivery/delivery.module').then(mod => mod.DeliveryModule) },
      { path: 'donation', loadChildren: () => import('~web/donation/donation.module').then(mod => mod.DonationModule) },
      { path: 'donor', loadChildren: () => import('~web/donor/donor.module').then(mod => mod.DonorModule) },
      { path: 'event', loadChildren: () => import('~web/event/event.module').then(mod => mod.EventModule) },
      { path: 'fundraise', loadChildren: () => import('~web/fundraise/fundraise.module').then(mod => mod.FundraiseModule) },
      { path: 'home', component: HomeComponent },
      { path: 'home/:login', component: HomeComponent },
      { path: 'notification', loadChildren: () => import('~web/notification/notification.module').then(mod => mod.NotificationModule) },
      { path: 'password', loadChildren: () => import('~web/password/password.module').then(mod => mod.PasswordModule) },
      { path: 'signup', loadChildren: () => import('~web/signup/signup.module').then(mod => mod.SignupModule) }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
