import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { AccountSharedModule } from '~web/account-shared/account-shared.module';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { DonationSharedModule } from '~web/donation-shared/donation-shared.module';
import { SharedModule } from '~web/shared/shared.module';
import { DonateComponent } from './components/donate/donate.component';
import { DonationEditComponent } from './components/donation-edit/donation-edit.component';
import { DonorRoutingModule } from './donor-routing.module';

@NgModule({
  declarations: [
    DonateComponent,
    DonationEditComponent
  ],
  imports: [
    DonorRoutingModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatInputModule,
    ReactiveFormsModule,
    SharedModule,
    DateTimeModule,
    AccountSharedModule,
    DonationSharedModule,
  ]
})
export class DonorModule {}
