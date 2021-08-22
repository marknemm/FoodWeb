import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGaurdService } from '~web/session/services/auth-gaurd/auth-gaurd.service';
import { AccountComponent } from './components/account/account.component';
import { AccountsComponent } from './components/accounts/accounts.component';

const routes: Routes = [
  { path: 'my', component: AccountComponent, canActivate: [AuthGaurdService] },
  { path: 'details', component: AccountComponent },
  { path: 'details/:id', component: AccountComponent },
  { path: 'list', component: AccountsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {}
