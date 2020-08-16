import { NgModule } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { AppLeftNavItemsComponent } from './child-components/app-left-nav-items/app-left-nav-items.component';
import { AppActionBarComponent } from './components/app-action-bar/app-action-bar.component';

@NgModule({
  declarations: [
    AppActionBarComponent,
    AppLeftNavItemsComponent
  ],
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule.forChild([]),
  ],
  exports: [

  ]
})
export class AppShellModule {}
