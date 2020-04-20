import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAccountDetailsComponent } from '~admin/admin-account/admin-account-details/admin-account-details.component';
import { AdminAccountsComponent } from '~admin/admin-account/admin-accounts/admin-accounts.component';
import { ComposeMessageComponent } from '~admin/admin-account/compose-message/compose-message.component';
import { CreateAccountComponent } from '~admin/admin-account/create-account/create-account.component';

const routes: Routes = [
  { path: 'compose-message', component: ComposeMessageComponent },
  { path: 'create', component: CreateAccountComponent },
  { path: 'create/:accountType', component: CreateAccountComponent },
  { path: 'details/:id', component: AdminAccountDetailsComponent },
  { path: 'list', component: AdminAccountsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminAccountRoutingModule {}
