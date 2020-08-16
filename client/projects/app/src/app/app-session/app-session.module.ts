import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppSharedModule } from '~app/app-shared/app-shared.module';
import { AppSessionRoutingModule } from './app-session-routing.module';
import { AppLoginComponent } from './components/app-login/app-login.component';

@NgModule({
  declarations: [
    AppLoginComponent
  ],
  imports: [
    CommonModule,
    AppSessionRoutingModule,
    ReactiveFormsModule,
    AppSharedModule
  ]
})
export class AppSessionModule {}
