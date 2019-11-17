import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared.module';
import { NotificationModule } from '~web/notification.module';

import { AppShellComponent } from '~web/app-shell/app-shell.component';
import { HeaderComponent } from '~web/header/header.component';
import { LeftNavComponent } from '~web/left-nav/left-nav.component';
import { SettingsMenuComponent } from '~web/settings-menu/settings-menu.component';
import { NotificationsMenuComponent } from '~web/notifications-menu/notifications-menu.component';
import { StickyHeaderDirective } from '~web/sticky-header/sticky-header.directive';

@NgModule({
  declarations: [
    AppShellComponent,
    HeaderComponent,
    LeftNavComponent,
    SettingsMenuComponent,
    NotificationsMenuComponent,
    StickyHeaderDirective
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    SharedModule,
    NotificationModule,
    FontAwesomeModule
  ],
  exports: [
    AppShellComponent,
    HeaderComponent,
    LeftNavComponent
  ]
})
export class AppShellModule {}
