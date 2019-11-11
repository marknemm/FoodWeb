import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';

import { LoginDialogComponent, LoginComponent } from '~web/session';

@NgModule({
  declarations: [
    LoginDialogComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ],
  exports: [
    LoginDialogComponent
  ],
  entryComponents: [
    LoginDialogComponent
  ]
})
export class SessionModule {}
