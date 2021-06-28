import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SessionModule } from '~hybrid/session/session.module';
import { SignupComponent } from '~hybrid/bootstrap/components/signup/signup.component';
import { BootstrapRoutingModule } from '~hybrid/bootstrap/bootstrap-routing.module';
import { SignupModule } from '~web/signup/signup.module';

@NgModule({
  imports: [
    CommonModule,
    BootstrapRoutingModule,
    SessionModule,
    SignupModule
  ],
  declarations: [
    SignupComponent
  ]
})
export class BootstrapModule {}
