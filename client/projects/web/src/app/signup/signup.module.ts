import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SignupRoutingModule } from '~web/signup/singup-routing.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';
import { AccountModule } from '~web/account/account.module';

import {
  SignupComponent,
  SignupVerificationComponent,
  TermsConditionsDialogComponent,
  AgreementBulletPointsComponent
} from '~web/signup';

@NgModule({
  declarations: [
    SignupComponent,
    SignupVerificationComponent,
    TermsConditionsDialogComponent,
    AgreementBulletPointsComponent
  ],
  imports: [
    SignupRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    MaterialModule,
    SharedModule,
    AccountModule
  ],
  entryComponents: [
    TermsConditionsDialogComponent
  ]
})
export class SignupModule {}
