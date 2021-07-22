import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IonicModule } from '@ionic/angular';
import { AccountSharedModule } from '~web/account-shared/account-shared.module';
import { NotificationSharedModule } from '~web/notification-shared/notification-shared.module';
import { SharedModule } from '~hybrid/shared/shared.module';
import { HeaderComponent } from './child-components/header/header.component';
import { LeftNavItemsComponent } from './child-components/left-nav-items/left-nav-items.component';
import { LeftNavComponent } from './child-components/left-nav/left-nav.component';
import { LoginMenuComponent } from './child-components/login-menu/login-menu.component';
import { NotificationsMenuComponent } from './child-components/notifications-menu/notifications-menu.component';
import { SettingsMenuComponent } from './child-components/settings-menu/settings-menu.component';
import { ShellComponent } from './components/shell/shell.component';
import { ShellModule as WebShellModule } from '~web/shell/shell.module';

@NgModule({
  declarations: [
    ShellComponent,
    HeaderComponent,
    LeftNavComponent,
    LeftNavItemsComponent,
    SettingsMenuComponent,
    NotificationsMenuComponent,
    LoginMenuComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    SharedModule,
    NotificationSharedModule,
    FontAwesomeModule,
    AccountSharedModule,
    WebShellModule
  ],
  exports: [
    HeaderComponent,
    LeftNavComponent,
    LoginMenuComponent,
    NotificationsMenuComponent,
    SettingsMenuComponent,
    LeftNavItemsComponent,
    WebShellModule
  ]
})
export class ShellModule {}
