import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '~hybrid/tabs/components/home/home.component';
import { TabsComponent } from '~hybrid/tabs/components/tabs/tabs.component';

const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'home/:login', component: HomeComponent },
      { path: 'delivery', loadChildren: () => import('../delivery/delivery.module').then(mod => mod.DeliveryModule) },
      { path: 'donation-hub', loadChildren: () => import('../donation-hub/donation-hub.module').then(mod => mod.DonationHubModule) },
      { path: 'settings', loadChildren: () => import('../settings/settings.module').then(mod => mod.SettingsModule) },
      { path: '**', redirectTo: '/home' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsRoutingModule {}
