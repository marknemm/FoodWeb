import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HybridLoginGuardService } from '~hybrid/hybrid-bootstrap/services/hybrid-login-guard/hybrid-login-guard.service';
import { HybridSignupComponent } from '~hybrid/hybrid-bootstrap/components/hybrid-signup/hybrid-signup.component';
import { LoginComponent } from '~web/session/components/login/login.component';

const routes: Routes = [
  { path: '', canActivate: [HybridLoginGuardService], canDeactivate: [HybridLoginGuardService],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: HybridSignupComponent },
      { path: 'signup/:accountType', component: HybridSignupComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HybridBootstrapRoutingModule {}
