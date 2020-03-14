import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdminAppShellComponent } from '~admin/admin-app-shell/admin-app-shell/admin-app-shell.component';
import { AdminHeaderActionsComponent } from '~admin/admin-app-shell/admin-header-actions/admin-header-actions.component';
import { AdminLeftNavItemsComponent } from '~admin/admin-app-shell/admin-left-nav-items/admin-left-nav-items.component';
import { AdminSettingsMenuComponent } from '~admin/admin-app-shell/admin-settings-menu/admin-settings-menu.component';
import { AccountModule } from '~web/account/account.module';
import { AppShellModule } from '~web/app-shell/app-shell.module';
import { HeaderComponent } from '~web/app-shell/header/header.component';
import { LeftNavComponent } from '~web/app-shell/left-nav/left-nav.component';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';

@NgModule({
  declarations: [
    AdminAppShellComponent,
    AdminHeaderActionsComponent,
    AdminLeftNavItemsComponent,
    AdminSettingsMenuComponent
  ],
  imports: [
    AccountModule,
    AppShellModule,
    CommonModule,
    FontAwesomeModule,
    MaterialModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    AdminAppShellComponent,
    HeaderComponent,
    LeftNavComponent
  ]
})
export class AdminAppShellModule {}