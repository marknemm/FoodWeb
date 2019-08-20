import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';

import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LeftNavComponent } from './domain-components/left-nav/left-nav.component';
import { HeaderComponent } from './domain-components/header/header.component';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { AlertSnackBarComponent } from './components/alert-snack-bar/alert-snack-bar.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { SignupVerificationComponent } from './components/signup-verification/signup-verification.component';
import { DonateComponent } from './components/donate/donate.component';
import { DonationsComponent } from './components/donations/donations.component';
import { DonationDetailsComponent } from './components/donation-details/donation-details.component';
import { DeliveriesComponent } from './components/deliveries/deliveries.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { DateTimeSelectDialogComponent } from './components/date-time-select-dialog/date-time-select-dialog.component';
import { AboutComponent } from './components/about/about.component';
import { TermsConditionsDialogComponent } from './components/terms-conditions-dialog/terms-conditions-dialog.component';

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
import { DonationFormComponent } from './child-components/donation-form/donation-form.component';
import { DonationStatusComponent } from './child-components/donation-status/donation-status.component';
import { ProfileImgComponent } from './child-components/profile-img/profile-img.component';
import { VolunteerComponent } from './child-components/volunteer/volunteer.component';
import { DateTimeComponent } from './child-components/date-time/date-time.component';
import { DateTimeRangeComponent } from './child-components/date-time-range/date-time-range.component';
import { DonationDetailActionsComponent } from './child-components/donation-detail-actions/donation-detail-actions.component';
import { AddressComponent } from './child-components/address/address.component';
import { DateTimeSelectComponent } from './child-components/date-time-select/date-time-select.component';
import { FoodSafetyChecklistComponent } from './child-components/food-safety-checklist/food-safety-checklist.component';
import { AgreementBulletPointsComponent } from './child-components/agreement-bullet-points/agreement-bullet-points.component';

import { ConfirmButtonDirective } from './directives/confirm-button/confirm-button.directive';

import { FormatDatePipe } from './pipes/format-date/format-date.pipe';
import { FormatTimePipe } from './pipes/format-time/format-time.pipe';
import { FormatDateTimePipe } from './pipes/format-date-time/format-date-time.pipe';

import { SessionMonitorService } from './services/session-monitor/session-monitor.service';
import { RecaptchaService } from './services/recaptcha/recaptcha.service';
import { AccountHelper } from '../../../shared/src/helpers/account-helper';
import { OperationHoursHelper } from '../../../shared/src/helpers/operation-hours-helper';
import { DonationHelper } from '../../../shared/src/helpers/donation-helper';
import { DeliveryHelper } from '../../../shared/src/helpers/delivery-helper';
import { JSONDateReviver } from '../../../shared/src/helpers/json-date-reviver';
import { EventCardComponent } from './child-components/event-card/event-card.component';
import { EventRegistrationsComponent } from './components/event-registrations/event-registrations.component';

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
    DateTimeSelectComponent,
    DateTimeSelectDialogComponent,
    FoodSafetyChecklistComponent,
    FormatDatePipe,
    FormatTimePipe,
    FormatDateTimePipe,
    AboutComponent,
    AgreementBulletPointsComponent,
    TermsConditionsDialogComponent,
    EventCardComponent,
    EventRegistrationsComponent,
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
    MatListModule,
    MatNativeDateModule,
    MatExpansionModule,
    NgxMaterialTimepickerModule,
    RecaptchaV3Module
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { horizontalPosition: 'right', verticalPosition: 'top', duration: 5000 } },
    { provide: HTTP_INTERCEPTORS, useClass: SessionMonitorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RecaptchaService, multi: true },
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptchaSiteKey },
    AccountHelper,
    OperationHoursHelper,
    DonationHelper,
    DeliveryHelper,
    JSONDateReviver
  ],
  entryComponents: [
    LoginComponent,
    AlertDialogComponent,
    AlertSnackBarComponent,
    DateTimeSelectDialogComponent,
    TermsConditionsDialogComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
