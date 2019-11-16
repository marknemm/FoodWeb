import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '~web/session';

import { BootstrapGuardService } from '~app/bootstrap/services/bootstrap-guard/bootstrap-guard.service';
import { AppSignupComponent } from '~app/bootstrap/components/app-signup/app-signup.component';

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
