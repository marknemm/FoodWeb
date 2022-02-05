import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '~web/home/components/home/home.component';
import { ShellComponent } from '~web/shell/components/shell/shell.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: 'account', loadChildren: () => import('~web/account/account.module').then(mod => mod.AccountModule) },
      { path: 'delivery', loadChildren: () => import('~web/delivery/delivery.module').then(mod => mod.DeliveryModule) },
      { path: 'donation', loadChildren: () => import('~web/donation/donation.module').then(mod => mod.DonationModule) },
      { path: 'donation-hub', loadChildren: () => import('~web/donation-hub/donation-hub.module').then(mod => mod.DonationHubModule) },
      { path: 'event', loadChildren: () => import('~web/event/event.module').then(mod => mod.EventModule) },
      { path: 'home/:login', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'information', loadChildren: () => import ('~web/information/information.module').then(mod => mod.InformationModule) },
      { path: 'notification', loadChildren: () => import('~web/notification/notification.module').then(mod => mod.NotificationModule) },
      { path: 'password', loadChildren: () => import('~web/password/password.module').then(mod => mod.PasswordModule) },
      { path: 'signup', loadChildren: () => import('~web/signup/signup.module').then(mod => mod.SignupModule) }
    ]
  },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
