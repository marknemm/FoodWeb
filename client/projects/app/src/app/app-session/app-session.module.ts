import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NativeScriptCommonModule, NativeScriptFormsModule, NativeScriptRouterModule } from '@nativescript/angular';
import { AppSharedModule } from '~app/app-shared/app-shared.module';
import { AppShellModule } from '~app/app-shell/app-shell.module';
import { AppLoginComponent } from './components/app-login/app-login.component';

@NgModule({
  declarations: [
    AppLoginComponent
  ],
  imports: [
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule.forChild([]),
    ReactiveFormsModule,
    AppSharedModule,
    AppShellModule,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppSessionModule {}
