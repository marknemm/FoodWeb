import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminAccountFiltersComponent } from '~admin/admin-account/admin-account-filters/admin-account-filters.component';
import { AdminAccountsComponent } from '~admin/admin-account/components/admin-accounts/admin-accounts.component';
import { AccountModule } from '~web/account/account.module';
import { FilterListModule } from '~web/filter-list/filter-list.module';
import { MaterialModule } from '~web/material.module';
import { AdminAccountRoutingModule } from './admin-account-routing.module';

@NgModule({
  declarations: [
    AdminAccountFiltersComponent,
    AdminAccountsComponent
  ],
  imports: [
    AdminAccountRoutingModule,
    CommonModule,
    AccountModule,
    FilterListModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    // Works as if we are extending the base Web AccountModule.
    AccountModule
  ]
})
export class AdminAccountModule {}
