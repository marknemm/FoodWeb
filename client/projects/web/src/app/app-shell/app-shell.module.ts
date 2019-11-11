import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';
import { NotificationModule } from '~web/notification/notification.module';

import { AppShellComponent, HeaderComponent, LeftNavComponent } from '~web/app-shell';

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
