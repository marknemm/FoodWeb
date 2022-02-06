import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AlertModule } from '~hybrid/alert/alert.module';
import { AppRoutingModule } from '~hybrid/app-routing.module';
import { AppComponent } from '~hybrid/app.component';
import { MapModule } from '~hybrid/map/map.module';
import { SessionModule } from '~hybrid/session/session.module';
import { SharedModule } from '~hybrid/shared/shared.module';
import { AccountHelper, DeliveryHelper, DonationHelper, JSONDateReviver, MapWaypointConverter, OperationHoursHelper } from '~shared';
import { EventModule } from '~web/event/event.module';
import { HeuristicsModule } from '~web/heuristics/heuristics.module';
import { HomeModule } from '~web/home/home.module';
import { SessionMonitorService } from '~web/session/services/session-monitor/session-monitor.service';
import { BootstrapModule } from './bootstrap/bootstrap.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxMaterialTimepickerModule,
    AppRoutingModule,
    SharedModule.forRoot(),
    AlertModule.forRoot(),
    BootstrapModule.forRoot(),
    SessionModule.forRoot(),
    MapModule.forRoot(),
    HomeModule,
    EventModule,
    HeuristicsModule
  ],
  bootstrap: [AppComponent],
  providers: [
    // { provide: APP_INITIALIZER, useFactory: () => initializeApp, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SessionMonitorService, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: Window, useValue: window },
    { provide: 'Window', useValue: window },
    AccountHelper,
    DeliveryHelper,
    DonationHelper,
    JSONDateReviver,
    MapWaypointConverter,
    OperationHoursHelper
  ]
})
export class AppModule {}
