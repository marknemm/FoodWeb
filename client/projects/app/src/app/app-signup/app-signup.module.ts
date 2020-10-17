import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { AppAccountSharedModule } from '~app/app-account-shared/app-account-shared.module';
import { AppSharedModule } from '~app/app-shared/app-shared.module';
import { AppShellModule } from '~app/app-shell/app-shell.module';
import { AppSignupRoutingModule } from './app-signup-routing.module';
import { AppSignupVerificationComponent } from './components/app-signup-verification/app-signup-verification.component';
import { AppSignupComponent } from './components/app-signup/app-signup.component';

@NgModule({
  declarations: [
    AppSignupComponent,
    AppSignupVerificationComponent,
  ],
  imports: [
    NativeScriptCommonModule,
    AppSignupRoutingModule,
    AppAccountSharedModule,
    AppSharedModule,
    AppShellModule,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppSignupModule {}
