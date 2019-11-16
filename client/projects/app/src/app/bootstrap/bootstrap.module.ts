import { NgModule } from '@angular/core';
import { BootstrapRoutingModule } from '~app/bootstrap/bootstrap-routing.module';
import { SignupModule } from '~web/signup/signup.module';

import { AppSessionModule } from '~app/app-session/app-session.module';
import { AppSignupComponent } from '~app/bootstrap/components/app-signup/app-signup.component';

@NgModule({
  imports: [
    BootstrapRoutingModule,
    AppSessionModule,
    SignupModule
  ],
  declarations: [
    AppSignupComponent
  ]
})
export class BootstrapModule {}
