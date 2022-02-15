import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '~hybrid/shared/shared.module';
import { AboutComponent } from './components/about/about.component';
import { CookiePolicyComponent } from './components/cookie-policy/cookie-policy.component';
import { MessageUsComponent } from './components/message-us/message-us.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { InformationRoutingModule } from './information-routing.module';

@NgModule({
  declarations: [
    AboutComponent,
    CookiePolicyComponent,
    MessageUsComponent,
    PrivacyPolicyComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    InformationRoutingModule,
    SharedModule,
  ]
})
export class InformationModule {}
