import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { AppSharedModule } from '~app/app-shared/app-shared.module';
import { AppShellModule } from '~app/app-shell/app-shell.module';
import { AppSessionRoutingModule } from './app-session-routing.module';
import { AppLoginComponent } from './components/app-login/app-login.component';

@NgModule({
  declarations: [
    AppLoginComponent
  ],
  imports: [
    NativeScriptCommonModule,
    AppSessionRoutingModule,
    ReactiveFormsModule,
    AppSharedModule,
    AppShellModule,
  ]
})
export class AppSessionModule {}
