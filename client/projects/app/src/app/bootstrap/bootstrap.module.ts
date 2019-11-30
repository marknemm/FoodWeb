import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSessionModule } from '~app/app-session/app-session.module';
import { AppSignupComponent } from '~app/bootstrap/app-signup/app-signup.component';
import { BootstrapRoutingModule } from '~app/bootstrap/bootstrap-routing.module';
import { SignupModule } from '~web/signup/signup.module';

@NgModule({
  imports: [
    CommonModule,
    BootstrapRoutingModule,
    AppSessionModule,
    SignupModule
  ],
  declarations: [
    AppSignupComponent
  ]
})
export class BootstrapModule {}
