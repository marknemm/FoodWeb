import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AccountModule } from '~web/account/account.module';
import { ShellModule } from '~web/shell/shell.module';
import { HeaderComponent } from '~web/shell/components/header/header.component';
import { LeftNavComponent } from '~web/shell/components/left-nav/left-nav.component';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';
import { AdminHeaderActionsComponent } from './child-components/admin-header-actions/admin-header-actions.component';
import { AdminLeftNavItemsComponent } from './child-components/admin-left-nav-items/admin-left-nav-items.component';
import { AdminSettingsMenuComponent } from './child-components/admin-settings-menu/admin-settings-menu.component';
import { AdminShellComponent } from './components/admin-shell/admin-shell.component';

@NgModule({
  declarations: [
    AdminShellComponent,
    AdminHeaderActionsComponent,
    AdminLeftNavItemsComponent,
    AdminSettingsMenuComponent
  ],
  imports: [
    AccountModule,
    ShellModule,
    CommonModule,
    FontAwesomeModule,
    MaterialModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    AdminShellComponent,
    HeaderComponent,
    LeftNavComponent
  ]
})
export class AdminShellModule {}
