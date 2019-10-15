import { NgModule } from '@angular/core';
import { MobileBootRoutingModule } from './mobile-boot-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AppShellModule } from '../app-shell/app-shell.module';
import { SessionModule } from '../session/session.module';
import { SignupModule } from '../signup/signup.module';

@NgModule({
  imports: [
    MobileBootRoutingModule,
    SharedModule,
    AppShellModule,
    SessionModule,
    SignupModule
  ]
})
export class MobileBootModule {}
