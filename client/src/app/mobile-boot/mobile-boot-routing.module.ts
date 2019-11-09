import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../session/components/login/login.component';
import { SignupComponent } from '../signup/components/signup/signup.component';
import { LoginRouteGuardService } from './services/login-route-guard/login-route-guard.service';

const routes: Routes = [
  { path: '', canActivate: [LoginRouteGuardService], canDeactivate: [LoginRouteGuardService],
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
export class MobileBootRoutingModule {}
