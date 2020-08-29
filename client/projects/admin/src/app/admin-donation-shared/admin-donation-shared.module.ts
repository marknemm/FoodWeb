import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DonationSharedModule } from '~web/donation-shared/donation-shared.module';
import { AdminDonationFormComponent } from './child-components/admin-donation-form/admin-donation-form.component';

@NgModule({
  declarations: [
    AdminDonationFormComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    AdminDonationFormComponent,
    DonationSharedModule, // Like extending (Web) DonationSharedModule.
  ]
})
export class AdminDonationSharedModule {}
