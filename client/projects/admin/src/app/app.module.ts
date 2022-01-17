import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { QuillModule } from 'ngx-quill';
import { AccountHelper, DeliveryHelper, DonationHelper, JSONDateReviver, MapWaypointConverter, OperationHoursHelper } from '~shared';
import { DeliveryScheduleService } from '~web/delivery/services/delivery-schedule/delivery-schedule.service';
import { DonationActionsService } from '~web/donation-shared/services/donation-actions/donation-actions.service';
import { DonationClaimService } from '~web/donation/services/donation-claim/donation-claim.service';
import { DonationSaveService } from '~web/donation/services/donation-save/donation-save.service';
import { SessionMonitorService } from '~web/session/services/session-monitor/session-monitor.service';
import { SharedModule } from '~web/shared/shared.module';
import { AdminBootstrapService } from './admin-bootstrap/services/admin-bootstrap/admin-bootstrap.service';
import { AdminConsoleModule } from './admin-console/admin-console.module';
import { AdminDeliveryScheduleService } from './admin-delivery/services/admin-delivery-schedule/admin-delivery-schedule.service';
import { AdminDonationActionsService } from './admin-donation/services/admin-donation-actions/admin-donation-actions.service';
import { AdminDonationClaimService } from './admin-donation/services/admin-donation-claim/admin-donation-claim.service';
import { AdminDonationSaveService } from './admin-donation/services/admin-donation-save/admin-donation-save.service';
import { AdminSessionModule } from './admin-session/admin-session.module';
import { AdminShellModule } from './admin-shell/admin-shell.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    AdminShellModule,
    AdminSessionModule.forRoot(),
    AdminConsoleModule,
    BrowserAnimationsModule,
    BrowserModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    NgxMaterialTimepickerModule,
    QuillModule.forRoot({
      theme: (window.innerWidth > 830) ? 'snow' : 'bubble'
    }),
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    // Define basic app tokens, interceptors, and config.
    { provide: Window, useValue: window },
    { provide: HTTP_INTERCEPTORS, useClass: SessionMonitorService, multi: true },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { horizontalPosition: 'right', verticalPosition: 'top', duration: 5000 } },
    // In base web code, anywhere where DonationActionsService is provided, provide AdminDonationActionsService instead.
    { provide: DeliveryScheduleService, useExisting: AdminDeliveryScheduleService },
    { provide: DonationActionsService, useExisting: AdminDonationActionsService },
    { provide: DonationClaimService, useExisting: AdminDonationClaimService },
    { provide: DonationSaveService, useExisting: AdminDonationSaveService },
    // Provide classes from root shared project.
    AccountHelper,
    DeliveryHelper,
    DonationHelper,
    JSONDateReviver,
    MapWaypointConverter,
    OperationHoursHelper,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(bootstrapService: AdminBootstrapService) {
    bootstrapService.listenSessionStateChange();
  }
}
