import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NativeScriptCommonModule, NativeScriptFormsModule } from '@nativescript/angular';
import { AppDateTimeModule } from '~app/app-date-time/app-date-time.module';
import { AppSharedModule } from '~app/app-shared/app-shared.module';
import { AppAccountCreationFormComponent } from './child-components/app-account-creation-form/app-account-creation-form.component';
import { AppAccountTypeComponent } from './child-components/app-account-type/app-account-type.component';
import { AppAddressComponent } from './child-components/app-address/app-address.component';
import { AppContactInfoComponent } from './child-components/app-contact-info/app-contact-info.component';
import { AppOperationHoursInfoComponent } from './child-components/app-operation-hours-info/app-operation-hours-info.component';
import { AppOperationHoursComponent } from './child-components/app-operation-hours/app-operation-hours.component';
import { AppOrganizationComponent } from './child-components/app-organization/app-organization.component';
import { AppPasswordComponent } from './child-components/app-password/app-password.component';
import { AppProfileImgComponent } from './child-components/app-profile-img/app-profile-img.component';
import { AppReceiverComponent } from './child-components/app-receiver/app-receiver.component';
import { AppUsernameComponent } from './child-components/app-username/app-username.component';
import { AppVolunteerComponent } from './child-components/app-volunteer/app-volunteer.component';
import { AppWeekdayOperationHoursComponent } from './child-components/app-weekday-operation-hours/app-weekday-operation-hours.component';

@NgModule({
  declarations: [
    AppAccountCreationFormComponent,
    AppAccountTypeComponent,
    AppAddressComponent,
    AppContactInfoComponent,
    AppOrganizationComponent,
    AppOperationHoursComponent,
    AppOperationHoursInfoComponent,
    AppPasswordComponent,
    AppProfileImgComponent,
    AppReceiverComponent,
    AppUsernameComponent,
    AppVolunteerComponent,
    AppWeekdayOperationHoursComponent,
  ],
  imports: [
    AppDateTimeModule,
    AppSharedModule,
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    AppAccountCreationFormComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppAccountSharedModule {}
