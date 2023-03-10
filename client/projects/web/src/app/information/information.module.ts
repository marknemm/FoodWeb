import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CookiePolicyComponent } from './components/cookie-policy/cookie-policy.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { InformationRoutingModule } from './information-routing.module';

@NgModule({
  declarations: [
    CookiePolicyComponent,
    PrivacyPolicyComponent,
  ],
  imports: [
    CommonModule,
    InformationRoutingModule,
    MatCardModule,
  ]
})
export class InformationModule {}
