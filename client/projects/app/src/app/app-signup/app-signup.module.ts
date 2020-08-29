import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { AppAccountModule } from '~app/app-account/app-account.module';
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
    AppAccountModule,
    AppShellModule,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppSignupModule {}
