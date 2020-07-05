import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { QuillModule } from 'ngx-quill';
import { AdminAccountCreateComponent } from '~admin/admin-account/admin-account-create/admin-account-create.component';
import { AdminAccountDetailsComponent } from '~admin/admin-account/admin-account-details/admin-account-details.component';
import { AdminAccountFiltersComponent } from '~admin/admin-account/admin-account-filters/admin-account-filters.component';
import { AdminAccountMessageComponent } from '~admin/admin-account/admin-account-message/admin-account-message.component';
import { AdminAccountsComponent } from '~admin/admin-account/admin-accounts/admin-accounts.component';
import { AdminVolunteerComponent } from '~admin/admin-account/admin-volunteer/admin-volunteer.component';
import { AdminPasswordModule } from '~admin/admin-password/admin-password.module';
import { AccountRoutingModule } from '~web/account/account-routing.module';
import { AccountModule } from '~web/account/account.module';
import { FilteredListModule } from '~web/filtered-list/filtered-list.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';
import { AdminAccountRoutingModule } from './admin-account-routing.module';

@NgModule({
  declarations: [
    AdminAccountCreateComponent,
    AdminAccountDetailsComponent,
    AdminAccountFiltersComponent,
    AdminAccountMessageComponent,
    AdminAccountsComponent,
    AdminVolunteerComponent
  ],
  imports: [
    AdminAccountRoutingModule,
    AccountRoutingModule,
    CommonModule,
    AccountModule,
    AdminPasswordModule,
    FilteredListModule,
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
