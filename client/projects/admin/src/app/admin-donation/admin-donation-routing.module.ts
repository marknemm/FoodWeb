import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateDonationComponent } from '~admin/admin-donation/create-donation/create-donation.component';

const routes: Routes = [
  { path: 'create', component: CreateDonationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDonationRoutingModule {}
