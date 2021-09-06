import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AccountSharedModule } from '~hybrid/account-shared/account-shared.module';
import { BootstrapRoutingModule } from '~hybrid/bootstrap/bootstrap-routing.module';
import { SignupComponent } from '~hybrid/bootstrap/components/signup/signup.component';
import { SessionModule } from '~hybrid/session/session.module';
import { SharedModule } from '~hybrid/shared/shared.module';
import { SignupModule } from '~web/signup/signup.module';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  imports: [
    CommonModule,
    BootstrapRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AccountSharedModule,
    SessionModule,
    SharedModule,
    SignupModule
  ],
  declarations: [
    SignupComponent,
    LoginComponent
  ]
})
export class BootstrapModule {}
