import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DateTimeModule } from '~hybrid/date-time/date-time.module';
import { SharedModule } from '~hybrid/shared/shared.module';
import { AccountSharedModule as WebAccountSharedModule } from '~web/account-shared/account-shared.module';
import { AccountCreationFormComponent } from './child-components/account-creation-form/account-creation-form.component';
import { AccountTeaserComponent } from './child-components/account-teaser/account-teaser.component';
import { AccountTypeComponent } from './child-components/account-type/account-type.component';
import { ContactInfoComponent } from './child-components/contact-info/contact-info.component';
import { OperationHoursFilterComponent } from './child-components/operation-hours-filter/operation-hours-filter.component';
import { OperationHoursComponent } from './child-components/operation-hours/operation-hours.component';
import { OrganizationComponent } from './child-components/organization/organization.component';
import { PasswordComponent } from './child-components/password/password.component';
import { ProfileImgComponent } from './child-components/profile-img/profile-img.component';
import { ReceiverComponent } from './child-components/receiver/receiver.component';
import { UsernameComponent } from './child-components/username/username.component';
import { VolunteerComponent } from './child-components/volunteer/volunteer.component';
import { WeekdayOperationHoursComponent } from './child-components/weekday-operation-hours/weekday-operation-hours.component';

@NgModule({
  declarations: [
    AccountCreationFormComponent,
    AccountTeaserComponent,
    AccountTypeComponent,
    ContactInfoComponent,
    OperationHoursComponent,
    OperationHoursFilterComponent,
    OrganizationComponent,
    PasswordComponent,
    ProfileImgComponent,
    ReceiverComponent,
    UsernameComponent,
    VolunteerComponent,
    WeekdayOperationHoursComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatIconModule,
    ReactiveFormsModule,
    RouterModule.forChild([]),
    DateTimeModule,
    SharedModule,
    WebAccountSharedModule,
  ],
  exports: [
    WebAccountSharedModule,
    AccountCreationFormComponent,
    AccountTeaserComponent,
    AccountTypeComponent,
    ContactInfoComponent,
    OperationHoursComponent,
    OperationHoursFilterComponent,
    OrganizationComponent,
    PasswordComponent,
    ProfileImgComponent,
    ReceiverComponent,
    UsernameComponent,
    VolunteerComponent,
  ]
})
export class AccountSharedModule {}
