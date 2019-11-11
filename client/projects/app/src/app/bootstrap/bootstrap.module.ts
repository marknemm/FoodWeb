import { NgModule } from '@angular/core';
import { BootstrapRoutingModule } from '~app/bootstrap/bootstrap-routing.module';
import { SessionModule } from '~web/session/session.module';
import { SignupModule } from '~web/signup/signup.module';

@NgModule({
  imports: [
    BootstrapRoutingModule,
    SessionModule,
    SignupModule
  ]
})
export class BootstrapModule {}
