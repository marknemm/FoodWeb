import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '../environments/environment';
import { AppShellComponent } from './app-shell/domain-components/app-shell/app-shell.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: (environment.mobile ? 'mobile/home' : 'home') },
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
      { path: 'signup', loadChildren: () => import('./signup/signup.module').then(mod => mod.SignupModule) },
      { path: 'account', loadChildren: () => import('./account/account.module').then(mod => mod.AccountModule) },
      { path: 'password', loadChildren: () => import('./password/password.module').then(mod => mod.PasswordModule) },
      { path: 'donation', loadChildren: () => import('./donation/donation.module').then(mod => mod.DonationModule) },
      { path: 'donor', loadChildren: () => import('./donor/donor.module').then(mod => mod.DonorModule) },
      { path: 'delivery', loadChildren: () => import('./delivery/delivery.module').then(mod => mod.DeliveryModule) },
      { path: 'notification', loadChildren: () => import('./notification/notification.module').then(mod => mod.NotificationModule) },
      { path: 'event', loadChildren: () => import('./event/event.module').then(mod => mod.EventModule) },
      { path: 'mobile', loadChildren: () => import('./mobile/mobile.module').then(mod => mod.MobileModule) }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
