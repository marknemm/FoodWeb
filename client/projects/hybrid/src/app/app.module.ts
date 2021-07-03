import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AppRoutingModule } from '~hybrid/app-routing.module';
import { AppComponent } from '~hybrid/app.component';
import { SessionModule } from '~hybrid/session/session.module';
import { AccountHelper, DeliveryHelper, DirectionsExtractor, DonationHelper, JSONDateReviver, MapWaypointConverter, OperationHoursHelper } from '~shared';
import { EventModule } from '~web/event/event.module';
import { HeuristicsModule } from '~web/heuristics/heuristics.module';
import { HomeModule } from '~web/home/home.module';
import { SessionMonitorService } from '~web/session/services/session-monitor/session-monitor.service';
import { SharedModule } from '~web/shared/shared.module';
import { ShellModule } from '~web/shell/shell.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxMaterialTimepickerModule,
    SharedModule,
    ShellModule,
    SessionModule.forRoot(),
    HomeModule,
    EventModule,
    HeuristicsModule
  ],
  bootstrap: [AppComponent],
  providers: [
    // { provide: APP_INITIALIZER, useFactory: () => initializeApp, multi: true },
    { provide: Window, useValue: window },
    { provide: HTTP_INTERCEPTORS, useClass: SessionMonitorService, multi: true },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { horizontalPosition: 'right', verticalPosition: 'top', duration: 5000 } },
    { provide: 'Window', useValue: window },
    AccountHelper,
    DeliveryHelper,
    DirectionsExtractor,
    DonationHelper,
    JSONDateReviver,
    MapWaypointConverter,
    OperationHoursHelper,
  ]
})
export class AppModule {}

// async function initializeApp(): Promise<any> {

// }
