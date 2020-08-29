import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { AppAccountRoutingModule } from './app-account-routing.module';
import { AppAccountCreationFormComponent } from './child-components/app-account-creation-form/app-account-creation-form.component';

@NgModule({
  declarations: [
    AppAccountCreationFormComponent
  ],
  imports: [
    NativeScriptCommonModule,
    AppAccountRoutingModule,
  ],
  exports: [
    AppAccountCreationFormComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppAccountModule {}
