import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AccountModule } from '~web/account/account.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';
import { AgreementBulletPointsComponent } from './child-components/agreement-bullet-points/agreement-bullet-points.component';
import { SignupVerificationComponent } from './components/signup-verification/signup-verification.component';
import { SignupComponent } from './components/signup/signup.component';
import { TermsConditionsDialogComponent } from './components/terms-conditions-dialog/terms-conditions-dialog.component';
import { SignupRoutingModule } from './signup-routing.module';

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
