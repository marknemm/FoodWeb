import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { SessionService } from '~web/session/services/session/session.service';
import { SessionModule } from '~web/session/session.module';
import { AdminSessionService } from './services/admin-session/admin-session.service';

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
export class AdminSessionModule {

  static forRoot(): ModuleWithProviders<AdminSessionModule> {
    return {
      ngModule: AdminSessionModule,
      providers: [
        // In base web code, anywhere where SessionService is provided, provide AppSessionService instead.
        { provide: SessionService, useExisting: AdminSessionService }
      ]
    };
  }
}
