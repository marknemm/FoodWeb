import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AccountCreationFormComponent } from '~web/account/account-creation-form/account-creation-form.component';
import { AccountDetailsComponent } from '~web/account/account-details/account-details.component';
import { AccountFiltersComponent } from '~web/account/account-filters/account-filters.component';
import { AccountRoutingModule } from '~web/account/account-routing.module';
import { AccountTeaserComponent } from '~web/account/account-teaser/account-teaser.component';
import { AccountTypeComponent } from '~web/account/account-type/account-type.component';
import { AccountsComponent } from '~web/account/accounts/accounts.component';
import { AddressComponent } from '~web/account/address/address.component';
import { ContactInfoComponent } from '~web/account/contact-info/contact-info.component';
import { DonorComponent } from '~web/account/donor/donor.component';
import { NotificationSettingsComponent } from '~web/account/notification-settings/notification-settings.component';
import { OperationHoursInfoComponent } from '~web/account/operation-hours-info/operation-hours-info.component';
import { OperationHoursComponent } from '~web/account/operation-hours/operation-hours.component';
import { OrganizationComponent } from '~web/account/organization/organization.component';
import { ProfileImgComponent } from '~web/account/profile-img/profile-img.component';
import { ReceiverComponent } from '~web/account/receiver/receiver.component';
import { UsernameComponent } from '~web/account/username/username.component';
import { VolunteerComponent } from '~web/account/volunteer/volunteer.component';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { FilteredListModule } from '~web/filtered-list/filtered-list.module';
import { MapModule } from '~web/map/map.module';
import { MaterialModule } from '~web/material.module';
import { PasswordModule } from '~web/password/password.module';
import { SharedModule } from '~web/shared/shared.module';

@NgModule({
  declarations: [
    AccountCreationFormComponent,
    AccountDetailsComponent,
    AccountFiltersComponent,
    AccountsComponent,
    AccountTeaserComponent,
    AccountTypeComponent,
    AddressComponent,
    ContactInfoComponent,
    DonorComponent,
    NotificationSettingsComponent,
    OrganizationComponent,
    OperationHoursInfoComponent,
    OperationHoursComponent,
    ProfileImgComponent,
    ReceiverComponent,
    UsernameComponent,
    VolunteerComponent
  ],
  imports: [
    AccountRoutingModule,
    CommonModule,
    DateTimeModule,
    FilteredListModule,
    MapModule,
    MaterialModule,
    MatSidenavModule,
    NgxMaterialTimepickerModule,
    PasswordModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    AccountCreationFormComponent,
    AccountDetailsComponent,
    AccountsComponent,
    AccountTeaserComponent,
    AccountTypeComponent,
    AddressComponent,
    ContactInfoComponent,
    NotificationSettingsComponent,
    OperationHoursComponent,
    OperationHoursInfoComponent,
    OrganizationComponent,
    PasswordModule,
    ProfileImgComponent,
    UsernameComponent,
    VolunteerComponent
  ]
})
export class AccountModule {}
