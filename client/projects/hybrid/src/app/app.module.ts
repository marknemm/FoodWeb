import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AppRoutingModule } from '~hybrid/app-routing.module';
import { HybridSessionModule } from '~hybrid/hybrid-session/hybrid-session.module';
import { AppComponent } from '~hybrid/app.component';
import { ShellModule } from '~web/shell/shell.module';
import { AboutComponent } from '~web/about/components/about/about.component';
import { HomeComponent } from '~web/home/components/home/home.component';
import { EventModule } from '~web/event/event.module';
import { HeuristicsModule } from '~web/heuristics/heuristics.module';
import { SharedModule } from '~web/shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent
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
    HybridSessionModule.forRoot(),
    EventModule,
    HeuristicsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
