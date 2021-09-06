import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '~web/session/services/auth-guard/auth-guard.service';
import { AccountListComponent } from './components/account-list/account-list.component';
import { AccountComponent } from './components/account/account.component';

const routes: Routes = [
  { path: 'list', component: AccountListComponent },
  { path: '', component: AccountComponent },
  { path: 'my', component: AccountComponent, canActivate: [AuthGuardService] },
  { path: ':id', component: AccountComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {}
