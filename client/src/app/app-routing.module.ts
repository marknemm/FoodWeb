import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { SignupVerificationComponent } from './components/signup-verification/signup-verification.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AccountComponent } from './components/account/account.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { AuthGaurdService } from './services/auth-gaurd/auth-gaurd.service';
import { DonateComponent } from './components/donate/donate.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: 'login', pathMatch: 'full', redirectTo: 'home/login'},
  {path: 'home', component: HomeComponent},
  {path: 'home/:login', component: HomeComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'signup-verification', component: SignupVerificationComponent},
  {path: 'account', component: AccountComponent, canActivate: [AuthGaurdService]},
  {path: 'logout', component: LogoutComponent},
  {path: 'accounts', component: AccountsComponent},
  {path: 'password-reset', component: PasswordResetComponent},
  {path: 'donate', component: DonateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
