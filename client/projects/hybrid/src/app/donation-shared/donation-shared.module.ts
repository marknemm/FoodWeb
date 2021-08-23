import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '~hybrid/shared/shared.module';
import { DonationSharedModule as WebDonationSharedModule } from '~web/donation-shared/donation-shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([]),
    WebDonationSharedModule,
    SharedModule,
  ],
  exports: [
    WebDonationSharedModule,
  ]
})
export class DonationSharedModule {}
