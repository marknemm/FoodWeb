import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatInputModule,
  MatSelectModule,
  MatCardModule,
  MatSidenavModule,
  MatCheckboxModule,
  MatRippleModule
} from '@angular/material';
import { AgmCoreModule } from '@agm/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/child-components/header/header.component';
import { LeftNavComponent } from './components/child-components/left-nav/left-nav.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LeftNavComponent,
    HomeComponent
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
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatRippleModule
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
