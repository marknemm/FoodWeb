import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AppSessionService } from '~app/app-session/app-session.service';
import { SessionModule } from '~web/session.module';
import { SessionService } from '~web/session/session.service';


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
export class AppSessionModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppSessionModule,
      providers: [
        // In base web code, anywhere where SessionService is provided, provide AppSessionService instead.
        { provide: SessionService, useExisting: AppSessionService }
      ]
    }
  }
}
