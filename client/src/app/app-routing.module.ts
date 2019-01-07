import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { SignupVerificationComponent } from './components/signup-verification/signup-verification.component';
import { DonorsComponent } from './components/donors/donors.component';
import { ReceiversComponent } from './components/receivers/receivers.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AccountComponent } from './components/account/account.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: 'login', pathMatch: 'full', redirectTo: 'home/login'},
  {path: 'home', component: HomeComponent},
  {path: 'home/:login', component: HomeComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'signup-verification', component: SignupVerificationComponent},
  {path: 'account', component: AccountComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'donors', component: DonorsComponent},
  {path: 'receivers', component: ReceiversComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
