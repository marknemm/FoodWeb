import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { AgmCoreModule } from '@agm/core';

import { AppBaseModule } from './app-base/app-base.module';
import { AppUserModule } from './app-user/app-user.module';
import { ReceiverDonorModule } from './receiver-donor/receiver-donor.module';
import { DelivererModule } from './deliverer/deliverer.module';

import { AppComponent } from './app.component';

const appRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home'
    }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        NgbModule,
        RouterModule.forRoot(appRoutes),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyALtc09EAL5qMDDV5UveWbxhAJqo6WV12g'
        }),
        BrowserModule,
        BrowserAnimationsModule,
        AppBaseModule,
        AppUserModule,
        ReceiverDonorModule,
        DelivererModule
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {}
