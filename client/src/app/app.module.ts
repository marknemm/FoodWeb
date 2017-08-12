import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpModule } from '@angular/http'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';


import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './authentication/login/login.component';
import { DonorComponent } from './donor/donor.component';
import { ReceiverComponent } from './receiver/receiver.component';
import { ImageCropperComponent } from 'ng2-img-cropper';
import { DateFormatterPipe } from "./shared/date-formatter.pipe"
import { AuthGaurdService } from './authentication/misc/auth-gaurd.service'

import { SignupComponent } from './authentication/signup/signup.component';
import { ReceiverCartComponent } from './receiver-cart/receiver-cart.component';
import { BannerComponent } from './banner/banner.component';
import { DonorCartComponent } from './donor-cart/donor-cart.component';
import { SlickLeftPanelComponent } from './slick-left-panel/slick-left-panel.component';
import { FoodListingsFiltersComponent } from './food-listings-filters/food-listings-filters.component';

const appRoutes: Routes = [
  /*{
    path: 'login', // This can be both modal popup and its own page!
    component: LoginComponent
  },*/
  { 
    path: '',
    pathMatch:'full', 
    redirectTo: '/home' 
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'donor',
    component: DonorComponent,
    canActivate: [ AuthGaurdService ]
  },
  {
    path: 'receiver',
    component: ReceiverComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    DonorComponent,
    ReceiverComponent,
    SignupComponent,
    ImageCropperComponent,
    DateFormatterPipe,
    ReceiverCartComponent,
    BannerComponent,
    DonorCartComponent,
    SlickLeftPanelComponent,
    FoodListingsFiltersComponent
  ],
  imports: [
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    BootstrapModalModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule, 
    AgmCoreModule.forRoot({apiKey: 'AIzaSyCljknY2lfGxVQDQbdDG1I53hiESK3QeqU'})
  ],
  entryComponents: [
    LoginComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [ 
    DateFormatterPipe,
    AuthGaurdService
  ]
})
export class AppModule { }

