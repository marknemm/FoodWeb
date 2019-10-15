import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { LoginComponent } from './components/login/login.component';

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
