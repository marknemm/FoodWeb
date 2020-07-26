import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGaurdService } from '~web/session/services/auth-gaurd/auth-gaurd.service';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { AccountsComponent } from './components/accounts/accounts.component';

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
