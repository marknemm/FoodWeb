import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared.module';
import { NotificationModule } from '~web/notification.module';

import { AppShellComponent } from '~web/app-shell/app-shell.component';
import { HeaderComponent } from '~web/header/header.component';
import { LeftNavComponent } from '~web/left-nav/left-nav.component';

@NgModule({
  declarations: [
    AppShellComponent,
    HeaderComponent,
    LeftNavComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    SharedModule,
    NotificationModule
  ],
  exports: [
    AppShellComponent,
    HeaderComponent,
    LeftNavComponent
  ]
})
export class AppShellModule {}
