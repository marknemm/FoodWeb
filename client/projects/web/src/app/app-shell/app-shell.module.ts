import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AccountModule } from '~web/account/account.module';
import { MaterialModule } from '~web/material.module';
import { NotificationModule } from '~web/notification/notification.module';
import { SharedModule } from '~web/shared/shared.module';
import { DonateMenuComponent } from './child-components/donate-menu/donate-menu.component';
import { HeaderActionsComponent } from './child-components/header-actions/header-actions.component';
import { LeftNavItemsComponent } from './child-components/left-nav-items/left-nav-items.component';
import { NotificationsMenuComponent } from './child-components/notifications-menu/notifications-menu.component';
import { SearchMenuComponent } from './child-components/search-menu/search-menu.component';
import { SettingsMenuComponent } from './child-components/settings-menu/settings-menu.component';
import { AppShellComponent } from './components/app-shell/app-shell.component';
import { HeaderComponent } from './components/header/header.component';
import { LeftNavComponent } from './components/left-nav/left-nav.component';
import { StickyHeaderDirective } from './directives/sticky-header/sticky-header.directive';

@NgModule({
  declarations: [
    AppShellComponent,
    HeaderActionsComponent,
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
