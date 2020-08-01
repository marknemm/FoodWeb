import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { QuillModule } from 'ngx-quill';
import { AdminPasswordModule } from '~admin/admin-password/admin-password.module';
import { AccountRoutingModule } from '~web/account/account-routing.module';
import { AccountModule } from '~web/account/account.module';
import { FilteredListModule } from '~web/filtered-list/filtered-list.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';
import { AdminAccountRoutingModule } from './admin-account-routing.module';
import { AdminAccountFiltersComponent } from './child-components/admin-account-filters/admin-account-filters.component';
import { AdminVolunteerComponent } from './child-components/admin-volunteer/admin-volunteer.component';
import { AdminAccountCreateComponent } from './components/admin-account-create/admin-account-create.component';
import { AdminAccountDetailsComponent } from './components/admin-account-details/admin-account-details.component';
import { AdminAccountMessageComponent } from './components/admin-account-message/admin-account-message.component';
import { AdminAccountsComponent } from './components/admin-accounts/admin-accounts.component';

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
