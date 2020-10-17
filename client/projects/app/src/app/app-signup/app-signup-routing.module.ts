import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';
import { AppSignupVerificationComponent } from './components/app-signup-verification/app-signup-verification.component';
import { AppSignupComponent } from './components/app-signup/app-signup.component';

export const routes: Routes = [
  { path: '', component: AppSignupComponent },
  { path: 'verification', component: AppSignupVerificationComponent },
  { path: ':accountType', component: AppSignupComponent },
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppSignupRoutingModule {}
