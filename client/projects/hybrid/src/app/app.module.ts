import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AlertModule } from '~hybrid/alert/alert.module';
import { AppRoutingModule } from '~hybrid/app-routing.module';
import { AppComponent } from '~hybrid/app.component';
import { SessionModule } from '~hybrid/session/session.module';
import { ShellModule } from '~hybrid/shell/shell.module';
import { AccountHelper, DeliveryHelper, DirectionsExtractor, DonationHelper, JSONDateReviver, MapWaypointConverter, OperationHoursHelper } from '~shared';
import { EventModule } from '~web/event/event.module';
import { HeuristicsModule } from '~web/heuristics/heuristics.module';
import { HomeModule } from '~web/home/home.module';
import { SessionMonitorService } from '~web/session/services/session-monitor/session-monitor.service';
import { SharedModule } from '~web/shared/shared.module';

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
    IonicModule.forRoot({ animated: true }),
    NgxMaterialTimepickerModule,
    SharedModule,
    ShellModule,
    AlertModule.forRoot(),
    SessionModule.forRoot(),
    HomeModule,
    EventModule,
    HeuristicsModule
  ],
  bootstrap: [AppComponent],
  providers: [
    // { provide: APP_INITIALIZER, useFactory: () => initializeApp, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SessionMonitorService, multi: true },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { horizontalPosition: 'right', verticalPosition: 'top', duration: 5000 } },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: Window, useValue: window },
    { provide: 'Window', useValue: window },
    AccountHelper,
    DeliveryHelper,
    DirectionsExtractor,
    DonationHelper,
    JSONDateReviver,
    MapWaypointConverter,
    OperationHoursHelper
  ]
})
export class AppModule {}
