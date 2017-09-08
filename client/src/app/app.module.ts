import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpModule } from '@angular/http'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { ImageCropperComponent } from 'ng2-img-cropper';
import { BusyModule } from 'angular2-busy';

import { MdListModule,
         MdCheckboxModule,
         MdRadioModule,
         MdButtonModule,
         MdInputModule,
         MdSelectModule,
         MdDatepickerModule,
         MdNativeDateModule,
         DateAdapter,
         NativeDateAdapter,
         MD_DATE_FORMATS,
         MD_NATIVE_DATE_FORMATS } from '@angular/material';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './authentication/login/login.component';
import { DonateComponent } from './donate/donate.component';
import { ReceiveComponent } from './receive/receive.component';
import { CartComponent } from './cart/cart.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { BannerComponent } from './banner/banner.component';
import { SlickLeftPanelComponent } from './slick-left-panel/slick-left-panel.component';
import { FoodListingsFiltersComponent } from './food-listings/food-listings-filters/food-listings-filters.component';
import { FoodListingsComponent } from './food-listings/food-listings.component';
import { FoodTypesComponent } from './food-listings/food-types/food-types.component';
import { AppUserInfoComponent } from './authentication/app-user-info/app-user-info.component';

import { AuthWatchService } from './authentication/misc/auth-watch.service'
import { AuthSessionService } from "./authentication/misc/auth-session.service";
import { FoodTypesService } from './food-listings/food-types/food-types.service';
import { DateFormatterPipe } from "./common-util/date-formatter.pipe"


const appRoutes: Routes = [
    /*{
        path: 'login', // This can be both modal popup and its own page!
        component: LoginComponent
    },*/
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home'
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthWatchService],
    },
    {
        path: 'donate',
        component: DonateComponent,
        canActivate: [AuthWatchService]
    },
    {
        path: 'receive',
        component: ReceiveComponent,
        canActivate: [AuthWatchService],
        // Make sure that we get the FoodTypes from the back end before routing to the receiver interface!
        resolve: {
            foodTypes: FoodTypesService
        }
    },
    {
        path: 'cart',
        component: CartComponent,
        canActivate: [AuthWatchService],
        // Make sure that we get the FoodTypes from the back end before routing to the cart interface!
        resolve: {
            foodTypes: FoodTypesService
        }
    },
    {
        path: 'signup',
        component: SignupComponent,
        canActivate: [AuthWatchService]
    },
    {
        path: 'appUserInfo',
        component: AppUserInfoComponent,
        canActivate: [AuthWatchService]
    }
];

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        HeaderComponent,
        FooterComponent,
        LoginComponent,
        DonateComponent,
        ReceiveComponent,
        SignupComponent,
        ImageCropperComponent,
        DateFormatterPipe,
        BannerComponent,
        SlickLeftPanelComponent,
        FoodListingsFiltersComponent,
        FoodListingsComponent,
        FoodTypesComponent,
        CartComponent,
        AppUserInfoComponent
    ],
    imports: [
        NgbModule.forRoot(),
        RouterModule.forRoot(appRoutes),
        BrowserModule,
        BrowserAnimationsModule,
        BootstrapModalModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        BusyModule,
        MdListModule,
        MdCheckboxModule,
        MdRadioModule,
        MdInputModule,
        MdSelectModule,
        MdButtonModule,
        MdDatepickerModule,
        MdNativeDateModule
    ],
    entryComponents: [
        LoginComponent
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [
        DateFormatterPipe,
        AuthWatchService,
        AuthSessionService,
        FoodTypesService,
        { provide: DateAdapter, useClass: NativeDateAdapter },
        { provide: MD_DATE_FORMATS, useValue: MD_NATIVE_DATE_FORMATS }
    ]
})
export class AppModule { }
