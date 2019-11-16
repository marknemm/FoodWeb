import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SignupRoutingModule } from '~web/signup-routing.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared.module';
import { AccountModule } from '~web/account.module';

import { SignupComponent } from '~web/signup/signup.component';
import { SignupVerificationComponent } from '~web/signup-verification/signup-verification.component';
import { TermsConditionsDialogComponent } from '~web/terms-conditions-dialog/terms-conditions-dialog.component';
import { AgreementBulletPointsComponent } from '~web/agreement-bullet-points/agreement-bullet-points.component';

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
  ],
  exports: [
    SignupComponent
  ]
})
export class SignupModule {}
