import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppSignupComponent } from '~app/bootstrap/app-signup/app-signup.component';
import { BootstrapGuardService } from '~app/bootstrap/bootstrap-guard/bootstrap-guard.service';
import { LoginComponent } from '~web/session/login/login.component';

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
