import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { SignupVerificationComponent } from './components/signup-verification/signup-verification.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { AuthGaurdService } from './services/auth-gaurd/auth-gaurd.service';
import { DonateComponent } from './components/donate/donate.component';
import { DonationsComponent } from './components/donations/donations.component';
import { DonationDetailsComponent } from './components/donation-details/donation-details.component';
import { DeliveriesComponent } from './components/deliveries/deliveries.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'login', pathMatch: 'full', redirectTo: 'home/login' },
  { path: 'home', component: HomeComponent },
  { path: 'home/:login', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signup/:accountType', component: SignupComponent },
  { path: 'signup-verification', component: SignupVerificationComponent },
  { path: 'account-details', component: AccountDetailsComponent, canActivate: [AuthGaurdService] },
  { path: 'account-details/:id', component: AccountDetailsComponent, canActivate: [AuthGaurdService] },
  { path: 'logout', component: LogoutComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: 'password-reset', component: PasswordResetComponent },
  { path: 'donate', component: DonateComponent },
  { path: 'donations', component: DonationsComponent },
  { path: 'donations/my', component: DonationsComponent, canActivate: [AuthGaurdService] },
  { path: 'donation-details/:id', component: DonationDetailsComponent },
  { path: 'deliveries', component: DeliveriesComponent },
  { path: 'deliveries/my', component: DeliveriesComponent, canActivate: [AuthGaurdService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
