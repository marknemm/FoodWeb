import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddressSettingsComponent } from './components/address-settings/address-settings.component';
import { ContactSettingsComponent } from './components/contact-settings/contact-settings.component';
import { NotificationSettingsComponent } from './components/notification-settings/notification-settings.component';
import { OperationHoursSettingsComponent } from './components/operation-hours-settings/operation-hours-settings.component';
import { PasswordSettingsComponent } from './components/password-settings/password-settings.component';
import { PrimarySettingsComponent } from './components/primary-settings/primary-settings.component';
import { SettingsPortalComponent } from './components/settings-portal/settings-portal.component';

const routes: Routes = [
  { path: '', component: SettingsPortalComponent },
  { path: 'address', component: AddressSettingsComponent },
  { path: 'contact', component: ContactSettingsComponent },
  { path: 'notifications', component: NotificationSettingsComponent },
  { path: 'operation-hours', component: OperationHoursSettingsComponent },
  { path: 'password', component: PasswordSettingsComponent },
  { path: 'primary', component: PrimarySettingsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
