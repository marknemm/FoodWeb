import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';
import { AppAccountDetailsComponent } from './components/app-account-details/app-account-details.component';

export const routes: Routes = [
  { path: 'my', component: AppAccountDetailsComponent },
  { path: 'details', component: AppAccountDetailsComponent },
  { path: 'details/:id', component: AppAccountDetailsComponent },
  // { path: 'list', component: AppAccountsComponent }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppAccountRoutingModule {}
