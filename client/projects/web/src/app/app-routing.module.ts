import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './shell/components/shell/shell.component';
import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  // Redirects from old app structure.
  { path: 'notifications', pathMatch: 'full', redirectTo: 'notification/list/my' },
  { path: 'signup-verification', pathMatch: 'full', redirectTo: 'signup/verification' },
  { path: 'donation-details/:id', pathMatch: 'full', redirectTo: 'donation/details/:id' },
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: 'about', component: AboutComponent },
      { path: 'account', loadChildren: () => import('./account/account.module').then(mod => mod.AccountModule) },
      { path: 'delivery', loadChildren: () => import('./delivery/delivery.module').then(mod => mod.DeliveryModule) },
      { path: 'donation', loadChildren: () => import('./donation/donation.module').then(mod => mod.DonationModule) },
      { path: 'donor', loadChildren: () => import('./donor/donor.module').then(mod => mod.DonorModule) },
      { path: 'event', loadChildren: () => import('./event/event.module').then(mod => mod.EventModule) },
      { path: 'fundraise', loadChildren: () => import('./fundraise/fundraise.module').then(mod => mod.FundraiseModule) },
      { path: 'home', component: HomeComponent },
      { path: 'home/:login', component: HomeComponent },
      { path: 'notification', loadChildren: () => import('./notification/notification.module').then(mod => mod.NotificationModule) },
      { path: 'password', loadChildren: () => import('./password/password.module').then(mod => mod.PasswordModule) },
      { path: 'signup', loadChildren: () => import('./signup/signup.module').then(mod => mod.SignupModule) }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
