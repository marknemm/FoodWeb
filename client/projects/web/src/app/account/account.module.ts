import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AccountRoutingModule } from '~web/account/account-routing.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';
import { PasswordModule } from '~web/password/password.module';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { MapModule } from '~web/map/map.module';

import {
  AccountDetailsComponent,
  AccountsComponent,
  AccountTypeComponent,
  UsernameComponent,
  ContactInfoComponent,
  OrganizationComponent,
  VolunteerComponent,
  OperationHoursComponent,
  AddressComponent,
  ProfileImgComponent,
  ReceiverComponent,
  DonorComponent
} from '~web/account';

@NgModule({
  declarations: [
    AccountDetailsComponent,
    AccountsComponent,
    AccountTypeComponent,
    UsernameComponent,
    ContactInfoComponent,
    OrganizationComponent,
    VolunteerComponent,
    OperationHoursComponent,
    AddressComponent,
    ProfileImgComponent,
    ReceiverComponent,
    DonorComponent
  ],
  imports: [
    AccountRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    MaterialModule,
    SharedModule,
    PasswordModule,
    DateTimeModule,
    MapModule
  ],
  exports: [
    PasswordModule,
    AccountDetailsComponent,
    AccountsComponent,
    AccountTypeComponent,
    UsernameComponent,
    ContactInfoComponent,
    OrganizationComponent,
    VolunteerComponent,
    AddressComponent,
    OperationHoursComponent
  ]
})
export class AccountModule {}
