import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AccountRoutingModule } from './account-routing.module';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { PasswordModule } from '../password/password.module';
import { DateTimeModule } from '../date-time/date-time.module';
import { MapModule } from '../map/map.module';

import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { AccountsComponent } from './components/accounts/accounts.component';

import { AccountTypeComponent } from './child-components/account-type/account-type.component';
import { UsernameComponent } from './child-components/username/username.component';
import { ContactInfoComponent } from './child-components/contact-info/contact-info.component';
import { OrganizationComponent } from './child-components/organization/organization.component';
import { VolunteerComponent } from './child-components/volunteer/volunteer.component';
import { OperationHoursComponent } from './child-components/operation-hours/operation-hours.component';
import { AddressComponent } from './child-components/address/address.component';
import { ProfileImgComponent } from './child-components/profile-img/profile-img.component';
import { ReceiverComponent } from './child-components/receiver/receiver.component';
import { DonorComponent } from './child-components/donor/donor.component';

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
