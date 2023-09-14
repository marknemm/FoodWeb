import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CookiePolicyComponent } from './components/cookie-policy/cookie-policy.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { InformationRoutingModule } from './information-routing.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { FaqComponent } from './components/faq/faq.component';

@NgModule({
  declarations: [
    CookiePolicyComponent,
    FaqComponent,
    PrivacyPolicyComponent,
  ],
  imports: [
    CommonModule,
    InformationRoutingModule,
    MatCardModule,
    MatExpansionModule,
  ]
})
export class InformationModule {}
