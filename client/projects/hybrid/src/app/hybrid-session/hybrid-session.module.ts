import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';
import { SessionModule } from '~web/session/session.module';
import { HybridAuthenticationService } from './services/hybrid-authentication/hybrid-authentication.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SessionModule
  ],
  exports: [
    // Works as if we are extending the base Web SessionModule.
    SessionModule
  ]
})
export class HybridSessionModule {

  static forRoot(): ModuleWithProviders<HybridSessionModule> {
    return {
      ngModule: HybridSessionModule,
      providers: [
        // In base web code, anywhere where AuthenticationService is provided, provide HybridAuthenticationService instead.
        { provide: AuthenticationService, useExisting: HybridAuthenticationService }
      ]
    }
  }
}
