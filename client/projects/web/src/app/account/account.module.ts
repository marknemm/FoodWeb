import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AccountSharedModule } from '~web/account-shared/account-shared.module';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { FilteredListModule } from '~web/filtered-list/filtered-list.module';
import { MapModule } from '~web/map/map.module';
import { SharedModule } from '~web/shared/shared.module';
import { AccountRoutingModule } from './account-routing.module';
import { AccountFiltersComponent } from './child-components/account-filters/account-filters.component';
import { NotificationSettingsComponent } from './child-components/notification-settings/notification-settings.component';
import { AccountListComponent } from './components/account-list/account-list.component';
import { AccountComponent } from './components/account/account.component';

@NgModule({
  declarations: [
    AccountComponent,
    AccountFiltersComponent,
    AccountListComponent,
    NotificationSettingsComponent,
  ],
  imports: [
    AccountRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    DateTimeModule,
    FilteredListModule,
    MapModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    MatSlideToggleModule,
    NgxMaterialTimepickerModule,
    AccountSharedModule,
    SharedModule,
  ],
  exports: [
    NotificationSettingsComponent,
  ]
})
export class AccountModule {}
