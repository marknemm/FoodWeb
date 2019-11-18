import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '~web/login/login.component';

import { BootstrapGuardService } from '~app/bootstrap-guard/bootstrap-guard.service';
import { AppSignupComponent } from '~app/app-signup/app-signup.component';

const routes: Routes = [
  { path: '', canActivate: [BootstrapGuardService], canDeactivate: [BootstrapGuardService],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: AppSignupComponent },
      { path: 'signup/:accountType', component: AppSignupComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BootstrapRoutingModule {}
