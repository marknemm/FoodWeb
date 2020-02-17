import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AdminAppShellModule } from '~admin/admin-app-shell/admin-app-shell.module';
import { AppRoutingModule } from '~admin/app-routing.module';
import { AppComponent } from '~admin/app.component';
import { BootstrapService } from '~admin/bootstrap/bootstrap/bootstrap.service';
import { AdminConsoleComponent } from '~admin/components/admin-console/admin-console.component';
import { MaterialModule } from '~web/material.module';
import { SessionModule } from '~web/session/session.module';
import { SharedModule } from '~web/shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    AdminConsoleComponent
  ],
  imports: [
    AdminAppShellModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    NgxMaterialTimepickerModule,
    ReactiveFormsModule,
    SessionModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(bootstrapService: BootstrapService) {
    bootstrapService.listenSessionStateChange();
  }
}
