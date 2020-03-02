import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAccountsComponent } from '~admin/admin-account/admin-accounts/admin-accounts.component';
import { ComposeMessageComponent } from '~admin/admin-account/compose-message/compose-message.component';

const routes: Routes = [
  { path: 'list', component: AdminAccountsComponent },
  { path: 'compose-message', component: ComposeMessageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminAccountRoutingModule {}
