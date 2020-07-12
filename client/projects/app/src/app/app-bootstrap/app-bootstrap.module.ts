import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSessionModule } from '~app/app-session/app-session.module';
import { AppSignupComponent } from '~app/app-bootstrap/app-signup/app-signup.component';
import { AppBootstrapRoutingModule } from '~app/app-bootstrap/app-bootstrap-routing.module';
import { SignupModule } from '~web/signup/signup.module';

@NgModule({
  imports: [
    CommonModule,
    AppBootstrapRoutingModule,
    AppSessionModule,
    SignupModule
  ],
  declarations: [
    AppSignupComponent
  ]
})
export class AppBootstrapModule {}
