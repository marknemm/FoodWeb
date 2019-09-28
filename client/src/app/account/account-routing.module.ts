import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { AuthGaurdService } from '../session/services/auth-gaurd/auth-gaurd.service';

const routes: Routes = [
  { path: 'my', component: AccountDetailsComponent, canActivate: [AuthGaurdService] },
  { path: 'details', component: AccountDetailsComponent },
  { path: 'details/:id', component: AccountDetailsComponent },
  { path: 'list', component: AccountsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {}
