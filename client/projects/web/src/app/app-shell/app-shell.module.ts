import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AccountModule } from '~web/account/account.module';
import { AppShellComponent } from '~web/app-shell/app-shell/app-shell.component';
import { DonateMenuComponent } from '~web/app-shell/donate-menu/donate-menu.component';
import { HeaderComponent } from '~web/app-shell/header/header.component';
import { LeftNavItemsComponent } from '~web/app-shell/left-nav-items/left-nav-items.component';
import { LeftNavComponent } from '~web/app-shell/left-nav/left-nav.component';
import { NotificationsMenuComponent } from '~web/app-shell/notifications-menu/notifications-menu.component';
import { SearchMenuComponent } from '~web/app-shell/search-menu/search-menu.component';
import { SettingsMenuComponent } from '~web/app-shell/settings-menu/settings-menu.component';
import { StickyHeaderDirective } from '~web/app-shell/sticky-header/sticky-header.directive';
import { MaterialModule } from '~web/material.module';
import { NotificationModule } from '~web/notification/notification.module';
import { SharedModule } from '~web/shared/shared.module';

@NgModule({
  declarations: [
    AppShellComponent,
    HeaderComponent,
    LeftNavComponent,
    LeftNavItemsComponent,
    SettingsMenuComponent,
    NotificationsMenuComponent,
    StickyHeaderDirective,
    DonateMenuComponent,
    SearchMenuComponent
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
    AppShellComponent,
    HeaderComponent,
    LeftNavComponent
  ]
})
export class AppShellModule {}
