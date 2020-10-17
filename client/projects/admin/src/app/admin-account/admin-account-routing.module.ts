import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAccountCreateComponent } from './components/admin-account-create/admin-account-create.component';
import { AdminAccountDetailsComponent } from './components/admin-account-details/admin-account-details.component';
import { AdminAccountMessageComponent } from './components/admin-account-message/admin-account-message.component';
import { AdminAccountsComponent } from './components/admin-accounts/admin-accounts.component';

const routes: Routes = [
  { path: 'my', component: AdminAccountDetailsComponent },
  { path: 'compose-message', component: AdminAccountMessageComponent },
  { path: 'create', component: AdminAccountCreateComponent },
  { path: 'create/:accountType', component: AdminAccountCreateComponent },
  { path: 'details/:id', component: AdminAccountDetailsComponent },
  { path: 'list', component: AdminAccountsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminAccountRoutingModule {}
