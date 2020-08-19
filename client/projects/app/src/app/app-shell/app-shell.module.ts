import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { AppActionBarComponent } from './child-components/app-action-bar/app-action-bar.component';
import { AppLeftNavItemsComponent } from './child-components/app-left-nav-items/app-left-nav-items.component';

@NgModule({
  declarations: [
    AppActionBarComponent,
    AppLeftNavItemsComponent,
  ],
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule.forChild([]),
  ],
  exports: [
    AppActionBarComponent,
    AppLeftNavItemsComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppShellModule {}
