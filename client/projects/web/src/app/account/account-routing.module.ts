import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountDetailsComponent } from '~web/account/account-details/account-details.component';
import { AccountsComponent } from '~web/account/accounts/accounts.component';
import { AuthGaurdService } from '~web/session/auth-gaurd/auth-gaurd.service';

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
