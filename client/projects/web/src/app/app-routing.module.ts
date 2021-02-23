import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '~web/home/components/home/home.component';
import { ShellComponent } from '~web/shell/components/shell/shell.component';
import { HubComponent } from './home/components/hub/hub.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {path: 'hub', component: HubComponent},
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: 'about', loadChildren: () => import ('~web/about/about.module').then(mod => mod.AboutModule) },
      { path: 'account', loadChildren: () => import('~web/account/account.module').then(mod => mod.AccountModule) },
      { path: 'delivery', loadChildren: () => import('~web/delivery/delivery.module').then(mod => mod.DeliveryModule) },
      { path: 'donation', loadChildren: () => import('~web/donation/donation.module').then(mod => mod.DonationModule) },
      { path: 'donation-hub', loadChildren: () => import('~web/donation-hub/donation-hub.module').then(mod => mod.DonationHubModule) },
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
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    relativeLinkResolution: 'legacy'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
