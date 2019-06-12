import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatInputModule,
  MatSelectModule,
  MatCardModule,
  MatSidenavModule,
  MatCheckboxModule,
  MatRippleModule,
  MatDialogModule,
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatRadioModule,
  MatTableModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatPaginatorModule,
  MatTooltipModule,
  MatDividerModule,
  MatDatepickerModule,
  MatNativeDateModule
} from '@angular/material';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';

import { environment } from 'src/environments/environment';
import { SessionMonitorService } from './services/session-monitor/session-monitor.service';
import { RecaptchaService } from './services/recaptcha/recaptcha.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { AlertSnackBarComponent } from './components/alert-snack-bar/alert-snack-bar.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { SignupVerificationComponent } from './components/signup-verification/signup-verification.component';
import { LeftNavComponent } from './child-components/left-nav/left-nav.component';
import { HeaderComponent } from './child-components/header/header.component';
import { OperationHoursComponent } from './child-components/operation-hours/operation-hours.component';
import { ContactInfoComponent } from './child-components/contact-info/contact-info.component';
import { OrganizationComponent } from './child-components/organization/organization.component';
import { AccountTypeComponent } from './child-components/account-type/account-type.component';
import { ProgressIndicatorComponent } from './child-components/progress-indicator/progress-indicator.component';
import { UsernameComponent } from './child-components/username/username.component';
import { PasswordComponent } from './child-components/password/password.component';
import { EditSaveButtonComponent } from './child-components/edit-save-button/edit-save-button.component';
import { PaginatorComponent } from './child-components/paginator/paginator.component';
import { ReturnLinkDirective } from './directives/return-link/return-link.directive';
import { DonateComponent } from './components/donate/donate.component';
import { DonationFormComponent } from './child-components/donation-form/donation-form.component';
import { DonationsComponent } from './components/donations/donations.component';
import { DonationDetailsComponent } from './components/donation-details/donation-details.component';
import { DonationStatusComponent } from './child-components/donation-status/donation-status.component';
import { ProfileImgComponent } from './child-components/profile-img/profile-img.component';
import { VolunteerComponent } from './child-components/volunteer/volunteer.component';
import { DeliveriesComponent } from './components/deliveries/deliveries.component';
import { DateTimeComponent } from './child-components/date-time/date-time.component';
import { DateTimeRangeComponent } from './child-components/date-time-range/date-time-range.component';
import { ConfirmButtonDirective } from './directives/confirm-button/confirm-button.directive';
import { DonationDetailActionsComponent } from './child-components/donation-detail-actions/donation-detail-actions.component';
import { AddressComponent } from './child-components/address/address.component';
import { NotificationsComponent } from './components/notifications/notifications.component';

import { AccountHelper } from '../../../shared/src/helpers/account-helper';
import { DonationHelper } from '../../../shared/src/helpers/donation-helper';
import { DeliveryHelper } from '../../../shared/src/helpers/delivery-helper';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LeftNavComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    AccountDetailsComponent,
    AccountsComponent,
    AlertDialogComponent,
    AlertSnackBarComponent,
    OperationHoursComponent,
    ContactInfoComponent,
    OrganizationComponent,
    AccountTypeComponent,
    SignupVerificationComponent,
    ProgressIndicatorComponent,
    UsernameComponent,
    PasswordComponent,
    EditSaveButtonComponent,
    PasswordResetComponent,
    PaginatorComponent,
    ReturnLinkDirective,
    DonateComponent,
    DonationFormComponent,
    DonationsComponent,
    DonationDetailsComponent,
    DonationStatusComponent,
    ProfileImgComponent,
    VolunteerComponent,
    DeliveriesComponent,
    DateTimeComponent,
    DateTimeRangeComponent,
    ConfirmButtonDirective,
    DonationDetailActionsComponent,
    AddressComponent,
    NotificationsComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatRippleModule,
    MatDialogModule,
    MatSnackBarModule,
    MatRadioModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule.forRoot(),
    RecaptchaV3Module
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { horizontalPosition: 'right', verticalPosition: 'top', duration: 5000 } },
    { provide: HTTP_INTERCEPTORS, useClass: SessionMonitorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RecaptchaService, multi: true },
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptchaSiteKey },
    AccountHelper,
    DonationHelper,
    DeliveryHelper
  ],
  entryComponents: [
    LoginComponent,
    AlertDialogComponent,
    AlertSnackBarComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
