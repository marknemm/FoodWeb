import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLoginGuardService } from '~app/app-bootstrap/app-login-guard/app-login-guard.service';
import { AppSignupComponent } from '~app/app-bootstrap/app-signup/app-signup.component';
import { LoginComponent } from '~web/session/login/login.component';

const routes: Routes = [
  { path: '', canActivate: [AppLoginGuardService], canDeactivate: [AppLoginGuardService],
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
export class AppBootstrapRoutingModule {}
