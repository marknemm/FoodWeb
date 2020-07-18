import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { QuillModule } from 'ngx-quill';
import { AdminAppShellModule } from '~admin/admin-app-shell/admin-app-shell.module';
import { AdminBootstrapService } from '~admin/admin-bootstrap/admin-bootstrap/admin-bootstrap.service';
import { AdminDeliveryScheduleService } from '~admin/admin-delivery/admin-delivery-schedule/admin-delivery-schedule.service';
import { AdminDonationActionsService } from '~admin/admin-donation/admin-donation-actions/admin-donation-actions.service';
import { AdminDonationClaimService } from '~admin/admin-donation/admin-donation-claim/admin-donation-claim.service';
import { AdminDonationSaveService } from '~admin/admin-donation/admin-donation-save/admin-donation-save.service';
import { AdminSessionModule } from '~admin/admin-session/admin-session.module';
import { AppRoutingModule } from '~admin/app-routing.module';
import { AppComponent } from '~admin/app.component';
import { AdminConsoleComponent } from '~admin/components/admin-console/admin-console.component';
import { DeliveryScheduleService } from '~web/delivery/delivery-schedule/delivery-schedule.service';
import { DonationActionsService } from '~web/donation-delivery-shared/donation-actions/donation-actions.service';
import { DonationClaimService } from '~web/donation/donation-claim/donation-claim.service';
import { DonationSaveService } from '~web/donation/donation-save/donation-save.service';
import { MaterialModule } from '~web/material.module';
import { SessionMonitorService } from '~web/session/session-monitor/session-monitor.service';
import { SharedModule } from '~web/shared/shared.module';

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
