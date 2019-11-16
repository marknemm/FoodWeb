import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AccountRoutingModule } from '~web/account-routing.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared.module';
import { PasswordModule } from '~web/password.module';
import { DateTimeModule } from '~web/date-time.module';
import { MapModule } from '~web/map.module';

import { AccountDetailsComponent } from '~web/account-details/account-details.component';
import { AccountsComponent } from '~web/accounts/accounts.component';
import { AccountTypeComponent } from '~web/account-type/account-type.component';
import { UsernameComponent } from '~web/username/username.component';
import { ContactInfoComponent } from '~web/contact-info/contact-info.component';
import { OrganizationComponent } from '~web/organization/organization.component';
import { VolunteerComponent } from '~web/volunteer/volunteer.component';
import { OperationHoursComponent } from '~web/operation-hours/operation-hours.component';
import { AddressComponent } from '~web/address/address.component';
import { ProfileImgComponent } from '~web/profile-img/profile-img.component';
import { ReceiverComponent } from '~web/receiver/receiver.component';
import { DonorComponent } from '~web/donor/donor.component';

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
