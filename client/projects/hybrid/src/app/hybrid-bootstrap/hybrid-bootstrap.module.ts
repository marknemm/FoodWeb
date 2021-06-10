import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HybridSessionModule } from '~hybrid/hybrid-session/hybrid-session.module';
import { HybridSignupComponent } from '~hybrid/hybrid-bootstrap/components/hybrid-signup/hybrid-signup.component';
import { HybridBootstrapRoutingModule } from '~hybrid/hybrid-bootstrap/hybrid-bootstrap-routing.module';
import { SignupModule } from '~web/signup/signup.module';

@NgModule({
  imports: [
    CommonModule,
    HybridBootstrapRoutingModule,
    HybridSessionModule,
    SignupModule
  ],
  declarations: [
    HybridSignupComponent
  ]
})
export class HybridBootstrapModule {}
