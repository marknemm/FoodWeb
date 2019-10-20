import { NgModule } from '@angular/core';
import { MobileBootRoutingModule } from './mobile-boot-routing.module';
import { SessionModule } from '../session/session.module';
import { SignupModule } from '../signup/signup.module';

@NgModule({
  imports: [
    MobileBootRoutingModule,
    SessionModule,
    SignupModule
  ]
})
export class MobileBootModule {}
