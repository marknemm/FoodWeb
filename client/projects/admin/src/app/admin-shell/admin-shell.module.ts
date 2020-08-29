import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AccountSharedModule } from '~web/account-shared/account-shared.module';
import { SharedModule } from '~web/shared/shared.module';
import { ShellModule } from '~web/shell/shell.module';
import { AdminHeaderActionsComponent } from './child-components/admin-header-actions/admin-header-actions.component';
import { AdminLeftNavItemsComponent } from './child-components/admin-left-nav-items/admin-left-nav-items.component';
import { AdminSettingsMenuComponent } from './child-components/admin-settings-menu/admin-settings-menu.component';
import { AdminShellComponent } from './components/admin-shell/admin-shell.component';

@NgModule({
  declarations: [
    AdminShellComponent,
    AdminHeaderActionsComponent,
    AdminLeftNavItemsComponent,
    AdminSettingsMenuComponent,
  ],
  imports: [
    AccountSharedModule,
    ShellModule,
    CommonModule,
    FontAwesomeModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    RouterModule,
    SharedModule,
  ],
  exports: [
    ShellModule,
  ]
})
export class AdminShellModule {}
