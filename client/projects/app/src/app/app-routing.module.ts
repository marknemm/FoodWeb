import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';
import { AppHomeComponent } from '~app/components/app-home/app-home.component';
import { AppAuthGuardService } from './app-session/services/app-auth-guard/app-auth-guard.service';

export const routes: Routes = [
  { path: '', canActivate: [AppAuthGuardService], children: [
    { path: '', pathMatch: 'full', redirectTo: '/home' },
    { path: 'home', component: AppHomeComponent },
  ]},
  { path: 'signup', loadChildren: () => import('~app/app-signup/app-signup.module').then(mod => mod.AppSignupModule) },
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {}
