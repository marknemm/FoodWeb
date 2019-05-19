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
import { AgmCoreModule } from '@agm/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { LogoutComponent } from './components/logout/logout.component';
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
import { SessionMonitorService } from './services/session-monitor/session-monitor.service';
import { ReturnLinkDirective } from './directives/return-link/return-link.directive';
import { DonateComponent } from './components/donate/donate.component';
import { DonationFormComponent } from './child-components/donation-form/donation-form.component';
import { DonationsComponent } from './components/donations/donations.component';
import { DonationDetailsComponent } from './components/donation-details/donation-details.component';
import { DonationStatusComponent } from './child-components/donation-status/donation-status.component';
import { AccountHelper } from '../../../shared/src/helpers/account-helper';
import { DonationHelper } from '../../../shared/src/helpers/donation-helper';
import { ProfileImgComponent } from './child-components/profile-img/profile-img.component';
import { VolunteerComponent } from './child-components/volunteer/volunteer.component';
import { DeliveriesComponent } from './components/deliveries/deliveries.component';
import { DateTimeComponent } from './child-components/date-time/date-time.component';
import { DateTimeRangeComponent } from './child-components/date-time-range/date-time-range.component';
import { ConfirmButtonDirective } from './directives/confirm-button/confirm-button.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LeftNavComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    LogoutComponent,
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
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyALtc09EAL5qMDDV5UveWbxhAJqo6WV12g'
    }),
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
    NgxMaterialTimepickerModule.forRoot()
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { horizontalPosition: 'right', verticalPosition: 'top', duration: 5000 } },
    { provide: HTTP_INTERCEPTORS, useClass: SessionMonitorService, multi: true },
    AccountHelper,
    DonationHelper
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
