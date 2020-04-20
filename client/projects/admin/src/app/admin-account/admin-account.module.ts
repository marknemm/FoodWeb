import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { QuillModule } from 'ngx-quill';
import { AdminAccountDetailsComponent } from '~admin/admin-account/admin-account-details/admin-account-details.component';
import { AdminAccountFiltersComponent } from '~admin/admin-account/admin-account-filters/admin-account-filters.component';
import { AdminVolunteerComponent } from '~admin/admin-account/admin-volunteer/admin-volunteer.component';
import { AdminAccountsComponent } from '~admin/admin-account/components/admin-accounts/admin-accounts.component';
import { ComposeMessageComponent } from '~admin/admin-account/compose-message/compose-message.component';
import { CreateAccountComponent } from '~admin/admin-account/create-account/create-account.component';
import { AdminPasswordModule } from '~admin/admin-password/admin-password.module';
import { AccountModule } from '~web/account/account.module';
import { FilterListModule } from '~web/filter-list/filter-list.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';
import { AdminAccountRoutingModule } from './admin-account-routing.module';

@NgModule({
  declarations: [
    AdminAccountDetailsComponent,
    AdminAccountFiltersComponent,
    AdminAccountsComponent,
    AdminVolunteerComponent,
    ComposeMessageComponent,
    CreateAccountComponent
  ],
  imports: [
    AdminAccountRoutingModule,
    CommonModule,
    AccountModule,
    AdminPasswordModule,
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
