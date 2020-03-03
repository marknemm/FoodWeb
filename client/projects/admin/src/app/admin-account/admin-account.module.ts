import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { QuillModule } from 'ngx-quill';
import { AdminAccountFiltersComponent } from '~admin/admin-account/admin-account-filters/admin-account-filters.component';
import { AdminAccountsComponent } from '~admin/admin-account/components/admin-accounts/admin-accounts.component';
import { ComposeMessageComponent } from '~admin/admin-account/compose-message/compose-message.component';
import { AccountModule } from '~web/account/account.module';
import { FilterListModule } from '~web/filter-list/filter-list.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';
import { AdminAccountRoutingModule } from './admin-account-routing.module';

@NgModule({
  declarations: [
    AdminAccountFiltersComponent,
    AdminAccountsComponent,
    ComposeMessageComponent
  ],
  imports: [
    AdminAccountRoutingModule,
    CommonModule,
    AccountModule,
    FilterListModule,
    FontAwesomeModule,
    MaterialModule,
    QuillModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    // Works as if we are extending the base Web AccountModule.
    AccountModule
  ]
})
export class AdminAccountModule {}
