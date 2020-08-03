import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AccountModule } from '~web/account/account.module';
import { MaterialModule } from '~web/material.module';
import { NotificationModule } from '~web/notification/notification.module';
import { SharedModule } from '~web/shared/shared.module';
import { HeaderActionsComponent } from './child-components/header-actions/header-actions.component';
import { HeaderNavigationComponent } from './child-components/header-navigation/header-navigation.component';
import { LeftNavItemsComponent } from './child-components/left-nav-items/left-nav-items.component';
import { LoginMenuComponent } from './child-components/login-menu/login-menu.component';
import { NotificationsMenuComponent } from './child-components/notifications-menu/notifications-menu.component';
import { SettingsMenuComponent } from './child-components/settings-menu/settings-menu.component';
import { HeaderComponent } from './components/header/header.component';
import { LeftNavComponent } from './components/left-nav/left-nav.component';
import { ShellComponent } from './components/shell/shell.component';

@NgModule({
  declarations: [
    ShellComponent,
    HeaderActionsComponent,
    HeaderComponent,
    LeftNavComponent,
    LeftNavItemsComponent,
    SettingsMenuComponent,
    NotificationsMenuComponent,
    HeaderNavigationComponent,
    LoginMenuComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    SharedModule,
    NotificationModule,
    FontAwesomeModule,
    AccountModule
  ],
  exports: [
    ShellComponent,
    HeaderComponent,
    LeftNavComponent
  ]
})
export class ShellModule {}
