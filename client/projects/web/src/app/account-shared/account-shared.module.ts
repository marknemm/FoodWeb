import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { SharedModule } from '~web/shared/shared.module';
import { AccountAutocompleteComponent } from './child-components/account-autocomplete/account-autocomplete.component';
import { AccountCreationFormComponent } from './child-components/account-creation-form/account-creation-form.component';
import { AccountSelectDialogComponent } from './child-components/account-select-dialog/account-select-dialog.component';
import { AccountSelectComponent } from './child-components/account-select/account-select.component';
import { AccountTeaserComponent } from './child-components/account-teaser/account-teaser.component';
import { AccountTypeComponent } from './child-components/account-type/account-type.component';
import { AddressComponent } from './child-components/address/address.component';
import { ContactInfoComponent } from './child-components/contact-info/contact-info.component';
import { OperationHoursInfoComponent } from './child-components/operation-hours-info/operation-hours-info.component';
import { OperationHoursComponent } from './child-components/operation-hours/operation-hours.component';
import { OrganizationComponent } from './child-components/organization/organization.component';
import { PasswordComponent } from './child-components/password/password.component';
import { ProfileImgComponent } from './child-components/profile-img/profile-img.component';
import { ReceiverComponent } from './child-components/receiver/receiver.component';
import { UsernameComponent } from './child-components/username/username.component';
import { VolunteerComponent } from './child-components/volunteer/volunteer.component';
import { AccountNamePipe } from './pipes/account-name/account-name.pipe';

@NgModule({
  declarations: [
    AccountAutocompleteComponent,
    AccountCreationFormComponent,
    AccountNamePipe,
    AccountSelectComponent,
    AccountSelectDialogComponent,
    AccountTeaserComponent,
    AccountTypeComponent,
    AddressComponent,
    ContactInfoComponent,
    OperationHoursComponent,
    OperationHoursInfoComponent,
    OrganizationComponent,
    PasswordComponent,
    ProfileImgComponent,
    ReceiverComponent,
    UsernameComponent,
    VolunteerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRippleModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatToolbarModule,
    ReactiveFormsModule,
    RouterModule.forChild([]),
    DateTimeModule,
    SharedModule,
  ],
  exports: [
    AccountAutocompleteComponent,
    AccountCreationFormComponent,
    AccountNamePipe,
    AccountSelectComponent,
    AccountSelectDialogComponent,
    AccountTeaserComponent,
    AccountTypeComponent,
    AddressComponent,
    ContactInfoComponent,
    OperationHoursComponent,
    OperationHoursInfoComponent,
    OrganizationComponent,
    PasswordComponent,
    ProfileImgComponent,
    ReceiverComponent,
    UsernameComponent,
    VolunteerComponent,
  ]
})
export class AccountSharedModule { }
