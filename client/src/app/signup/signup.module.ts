import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SignupRoutingModule } from './singup-routing.module';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { AccountModule } from '../account/account.module';
import { SignupComponent } from './components/signup/signup.component';
import { SignupVerificationComponent } from './components/signup-verification/signup-verification.component';
import { TermsConditionsDialogComponent } from './components/terms-conditions-dialog/terms-conditions-dialog.component';
import { AgreementBulletPointsComponent } from './child-components/agreement-bullet-points/agreement-bullet-points.component';

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
