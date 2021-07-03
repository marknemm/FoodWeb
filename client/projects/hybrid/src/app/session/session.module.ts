import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AuthenticationService as WebAuthenticationService } from '~web/session/services/authentication/authentication.service';
import { SessionService as WebSessionService } from '~web/session/services/session/session.service';
import { SessionModule as WebSessionModule } from '~web/session/session.module';
import { AuthenticationService } from './services/authentication/authentication.service';
import { SessionService } from './services/session/session.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    WebSessionModule
  ],
  exports: [
    // Works as if we are extending the base Web SessionModule.
    WebSessionModule
  ]
})
export class SessionModule {

  static forRoot(): ModuleWithProviders<SessionModule> {
    return {
      ngModule: SessionModule,
      providers: [
        // In base web code, anywhere where AuthenticationService is provided, provide HybridAuthenticationService instead.
        { provide: WebAuthenticationService, useExisting: AuthenticationService },
        { provide: WebSessionService, useExisting: SessionService },
      ]
    }
  }
}
