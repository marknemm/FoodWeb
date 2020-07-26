import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { FilteredListModule } from '~web/filtered-list/filtered-list.module';
import { MapModule } from '~web/map/map.module';
import { MaterialModule } from '~web/material.module';
import { PasswordModule } from '~web/password/password.module';
import { SharedModule } from '~web/shared/shared.module';
import { AccountRoutingModule } from './account-routing.module';
import { AccountAutocompleteComponent } from './child-components/account-autocomplete/account-autocomplete.component';
import { AccountCreationFormComponent } from './child-components/account-creation-form/account-creation-form.component';
import { AccountFiltersComponent } from './child-components/account-filters/account-filters.component';
import { AccountSelectDialogComponent } from './child-components/account-select-dialog/account-select-dialog.component';
import { AccountSelectComponent } from './child-components/account-select/account-select.component';
import { AccountTeaserComponent } from './child-components/account-teaser/account-teaser.component';
import { AccountTypeComponent } from './child-components/account-type/account-type.component';
import { AddressComponent } from './child-components/address/address.component';
import { ContactInfoComponent } from './child-components/contact-info/contact-info.component';
import { DonorComponent } from './child-components/donor/donor.component';
import { NotificationSettingsComponent } from './child-components/notification-settings/notification-settings.component';
import { OperationHoursInfoComponent } from './child-components/operation-hours-info/operation-hours-info.component';
import { OperationHoursComponent } from './child-components/operation-hours/operation-hours.component';
import { OrganizationComponent } from './child-components/organization/organization.component';
import { ProfileImgComponent } from './child-components/profile-img/profile-img.component';
import { ReceiverComponent } from './child-components/receiver/receiver.component';
import { UsernameComponent } from './child-components/username/username.component';
import { VolunteerComponent } from './child-components/volunteer/volunteer.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { AccountNamePipe } from './pipes/account-name/account-name.pipe';

@NgModule({
  declarations: [
    AccountAutocompleteComponent,
    AccountCreationFormComponent,
    AccountDetailsComponent,
    AccountFiltersComponent,
    AccountsComponent,
    AccountSelectComponent,
    AccountSelectDialogComponent,
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
    VolunteerComponent,
    AccountNamePipe
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
    AccountAutocompleteComponent,
    AccountCreationFormComponent,
    AccountDetailsComponent,
    AccountsComponent,
    AccountSelectComponent,
    AccountSelectDialogComponent,
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
