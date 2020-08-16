import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';
import { AppLoginComponent } from './components/app-login/app-login.component';

export const routes: Routes = [
  { path: 'login', component: AppLoginComponent },
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppSessionRoutingModule {}
