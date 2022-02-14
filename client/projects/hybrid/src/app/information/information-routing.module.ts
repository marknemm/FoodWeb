import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { CookiePolicyComponent } from './components/cookie-policy/cookie-policy.component';
import { MessageUsComponent } from './components/message-us/message-us.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';

const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'cookie-policy', component: CookiePolicyComponent },
  { path: 'message-us', component: MessageUsComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformationRoutingModule {}
