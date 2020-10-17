import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AccountSharedModule } from '~web/account-shared/account-shared.module';
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
    AgreementBulletPointsComponent,
  ],
  imports: [
    SignupRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    NgxMaterialTimepickerModule,
    SharedModule,
    AccountSharedModule,
  ]
})
export class SignupModule {}
