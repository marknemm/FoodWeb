import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdminAccountSharedModule } from '~admin/admin-account-shared/admin-account-shared.module';
import { SharedModule } from '~web/shared/shared.module';
import { ShellModule } from '~web/shell/shell.module';
import { AdminLeftNavItemsComponent } from './child-components/admin-left-nav-items/admin-left-nav-items.component';
import { AdminSettingsMenuComponent } from './child-components/admin-settings-menu/admin-settings-menu.component';
import { AdminShellComponent } from './components/admin-shell/admin-shell.component';

@NgModule({
  declarations: [
    AdminLeftNavItemsComponent,
    AdminSettingsMenuComponent,
    AdminShellComponent,
  ],
  imports: [
    AdminAccountSharedModule,
    CommonModule,
    FontAwesomeModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    RouterModule,
    SharedModule,
    ShellModule,
  ],
  exports: [
    ShellModule,
  ]
})
export class AdminShellModule {}
