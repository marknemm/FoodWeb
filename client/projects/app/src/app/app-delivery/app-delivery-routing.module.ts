import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';
import { AppDeliveryDetailsComponent } from './components/app-delivery-details/app-delivery-details.component';

const routes: Routes = [
  { path: 'details/:id', component: AppDeliveryDetailsComponent }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppDeliveryRoutingModule {}
