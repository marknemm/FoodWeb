import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AccountModule } from '~web/account/account.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';
import { AgreementBulletPointsComponent } from '~web/signup/agreement-bullet-points/agreement-bullet-points.component';
import { SignupRoutingModule } from '~web/signup/signup-routing.module';
import { SignupVerificationComponent } from '~web/signup/signup-verification/signup-verification.component';
import { SignupComponent } from '~web/signup/signup/signup.component';
import { TermsConditionsDialogComponent } from '~web/signup/terms-conditions-dialog/terms-conditions-dialog.component';

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
  exports: [
    SignupComponent
  ]
})
export class SignupModule {}
