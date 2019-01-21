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
  MatPaginatorModule
} from '@angular/material';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AgmCoreModule } from '@agm/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/child-components/header/header.component';
import { LeftNavComponent } from './components/child-components/left-nav/left-nav.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AccountComponent } from './components/account/account.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { AlertSnackBarComponent } from './components/alert-snack-bar/alert-snack-bar.component';
import { OperationHoursComponent } from './components/child-components/operation-hours/operation-hours.component';
import { ContactInfoComponent } from './components/child-components/contact-info/contact-info.component';
import { OrganizationComponent } from './components/child-components/organization/organization.component';
import { AccountTypeComponent } from './components/child-components/account-type/account-type.component';
import { SignupVerificationComponent } from './components/signup-verification/signup-verification.component';
import { ProgressIndicatorComponent } from './components/child-components/progress-indicator/progress-indicator.component';
import { UsernameComponent } from './components/child-components/username/username.component';
import { PasswordComponent } from './components/child-components/password/password.component';
import { EditSaveButtonComponent } from './components/child-components/edit-save-button/edit-save-button.component';
import { SessionMonitorService } from './services/session-monitor/session-monitor.service';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { PaginatorComponent } from './components/child-components/paginator/paginator.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LeftNavComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    LogoutComponent,
    AccountComponent,
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
    NgxMaterialTimepickerModule.forRoot()
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { horizontalPosition: 'right', verticalPosition: 'top' } },
    { provide: HTTP_INTERCEPTORS, useClass: SessionMonitorService, multi: true }
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
