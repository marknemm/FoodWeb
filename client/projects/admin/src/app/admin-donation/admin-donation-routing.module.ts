import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminCreateDonationComponent } from './components/admin-create-donation/admin-create-donation.component';
import { AdminEditDonationComponent } from './components/admin-edit-donation/admin-edit-donation.component';

const routes: Routes = [
  { path: 'create', component: AdminCreateDonationComponent },
  { path: 'edit/:id', component: AdminEditDonationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDonationRoutingModule {}
