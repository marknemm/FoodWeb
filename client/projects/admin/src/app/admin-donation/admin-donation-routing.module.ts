import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDonationCreateComponent } from './components/admin-donation-create/admin-donation-create.component';
import { AdminDonationEditComponent } from './components/admin-donation-edit/admin-donation-edit.component';

const routes: Routes = [
  { path: 'create', component: AdminDonationCreateComponent },
  { path: 'edit/:id', component: AdminDonationEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDonationRoutingModule {}
