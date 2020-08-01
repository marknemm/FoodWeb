import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { QuillModule } from 'ngx-quill';
import { DeliveryScheduleService } from '~web/delivery/services/delivery-schedule/delivery-schedule.service';
import { DonationActionsService } from '~web/donation-delivery-shared/services/donation-actions/donation-actions.service';
import { DonationClaimService } from '~web/donation/services/donation-claim/donation-claim.service';
import { DonationSaveService } from '~web/donation/services/donation-save/donation-save.service';
import { MaterialModule } from '~web/material.module';
import { SessionMonitorService } from '~web/session/services/session-monitor/session-monitor.service';
import { SharedModule } from '~web/shared/shared.module';
import { AdminAppShellModule } from './admin-app-shell/admin-app-shell.module';
import { AdminBootstrapService } from './admin-bootstrap/services/admin-bootstrap/admin-bootstrap.service';
import { AdminDeliveryScheduleService } from './admin-delivery/services/admin-delivery-schedule/admin-delivery-schedule.service';
import { AdminDonationActionsService } from './admin-donation/services/admin-donation-actions/admin-donation-actions.service';
import { AdminDonationClaimService } from './admin-donation/services/admin-donation-claim/admin-donation-claim.service';
import { AdminDonationSaveService } from './admin-donation/services/admin-donation-save/admin-donation-save.service';
import { AdminSessionModule } from './admin-session/admin-session.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminConsoleComponent } from './components/admin-console/admin-console.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminConsoleComponent
  ],
  imports: [
    AdminAppShellModule,
    AdminSessionModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    NgxMaterialTimepickerModule,
    QuillModule.forRoot({
      theme: (window.innerWidth > 830) ? 'snow' : 'bubble'
    }),
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SessionMonitorService, multi: true },
    // In base web code, anywhere where DonationActionsService is provided, provide AdminDonationActionsService instead.
    { provide: DonationActionsService, useExisting: AdminDonationActionsService },
    { provide: DonationSaveService, useExisting: AdminDonationSaveService },
    { provide: DonationClaimService, useExisting: AdminDonationClaimService },
    { provide: DeliveryScheduleService, useExisting: AdminDeliveryScheduleService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(bootstrapService: AdminBootstrapService) {
    bootstrapService.listenSessionStateChange();
  }
}
