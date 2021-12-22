import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAccountCreateComponent } from './components/admin-account-create/admin-account-create.component';
import { AdminAccountListComponent } from './components/admin-account-list/admin-account-list.component';
import { AdminAccountMessageComponent } from './components/admin-account-message/admin-account-message.component';
import { AdminAccountComponent } from './components/admin-account/admin-account.component';

const routes: Routes = [
  { path: 'compose-message', component: AdminAccountMessageComponent },
  { path: 'create', component: AdminAccountCreateComponent },
  { path: 'create/:accountType', component: AdminAccountCreateComponent },
  { path: 'list', component: AdminAccountListComponent },
  { path: '', component: AdminAccountComponent },
  { path: 'my', component: AdminAccountComponent },
  { path: ':id', component: AdminAccountComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminAccountRoutingModule {}
