import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AccountDetailsComponent } from '~web/account/account-details/account-details.component';
import { AccountRoutingModule } from '~web/account/account-routing.module';
import { AccountTeaserComponent } from '~web/account/account-teaser/account-teaser.component';
import { AccountTypeComponent } from '~web/account/account-type/account-type.component';
import { AccountsComponent } from '~web/account/accounts/accounts.component';
import { AddressComponent } from '~web/account/address/address.component';
import { NotificationSettingsComponent } from '~web/account/child-components/notification-settings/notification-settings.component';
import { ContactInfoComponent } from '~web/account/contact-info/contact-info.component';
import { DonorComponent } from '~web/account/donor/donor.component';
import { OperationHoursInfoComponent } from '~web/account/operation-hours-info/operation-hours-info.component';
import { OperationHoursComponent } from '~web/account/operation-hours/operation-hours.component';
import { OrganizationComponent } from '~web/account/organization/organization.component';
import { ProfileImgComponent } from '~web/account/profile-img/profile-img.component';
import { ReceiverComponent } from '~web/account/receiver/receiver.component';
import { UsernameComponent } from '~web/account/username/username.component';
import { VolunteerComponent } from '~web/account/volunteer/volunteer.component';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { MapModule } from '~web/map/map.module';
import { MaterialModule } from '~web/material.module';
import { PasswordModule } from '~web/password/password.module';
import { SharedModule } from '~web/shared/shared.module';

@NgModule({
  declarations: [
    AccountDetailsComponent,
    AccountsComponent,
    AccountTeaserComponent,
    AccountTypeComponent,
    UsernameComponent,
    ContactInfoComponent,
    OrganizationComponent,
    VolunteerComponent,
    OperationHoursInfoComponent,
    OperationHoursComponent,
    AddressComponent,
    ProfileImgComponent,
    ReceiverComponent,
    DonorComponent,
    NotificationSettingsComponent
  ],
  imports: [
    AccountRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    MaterialModule,
    MatSidenavModule,
    SharedModule,
    PasswordModule,
    DateTimeModule,
    MapModule
  ],
  exports: [
    PasswordModule,
    AccountDetailsComponent,
    AccountsComponent,
    AccountTeaserComponent,
    AccountTypeComponent,
    UsernameComponent,
    ContactInfoComponent,
    OrganizationComponent,
    VolunteerComponent,
    AddressComponent,
    OperationHoursInfoComponent,
    OperationHoursComponent,
    ProfileImgComponent
  ]
})
export class AccountModule {}
