import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuardService } from '~hybrid/bootstrap/services/login-guard/login-guard.service';
import { SignupComponent } from '~hybrid/bootstrap/components/signup/signup.component';
import { LoginComponent } from '~hybrid/bootstrap/components/login/login.component';

const routes: Routes = [
  { path: '',
    canActivate: [LoginGuardService],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'signup/:accountType', component: SignupComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BootstrapRoutingModule {}
