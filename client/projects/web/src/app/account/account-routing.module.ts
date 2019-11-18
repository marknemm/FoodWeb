import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGaurdService } from '~web/auth-gaurd/auth-gaurd.service';

import { AccountDetailsComponent } from '~web/account-details/account-details.component';
import { AccountsComponent } from '~web/accounts/accounts.component';

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
