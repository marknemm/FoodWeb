import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AccountSharedModule } from '~hybrid/account-shared/account-shared.module';
import { SharedModule } from '~hybrid/shared/shared.module';
import { AccountModule as WebAccountModule } from '~web/account/account.module';
import { AddressSettingsComponent } from './components/address-settings/address-settings.component';
import { ContactSettingsComponent } from './components/contact-settings/contact-settings.component';
import { NotificationSettingsComponent } from './components/notification-settings/notification-settings.component';
import { OperationHoursSettingsComponent } from './components/operation-hours-settings/operation-hours-settings.component';
import { PasswordSettingsComponent } from './components/password-settings/password-settings.component';
import { PrimarySettingsComponent } from './components/primary-settings/primary-settings.component';
import { SettingsPortalComponent } from './components/settings-portal/settings-portal.component';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
  declarations: [
    AddressSettingsComponent,
    ContactSettingsComponent,
    NotificationSettingsComponent,
    OperationHoursSettingsComponent,
    PasswordSettingsComponent,
    PrimarySettingsComponent,
    SettingsPortalComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    SharedModule,
    AccountSharedModule,
    SettingsRoutingModule,
    WebAccountModule,
  ],
  exports: [
    WebAccountModule,
  ]
})
export class SettingsModule {}
