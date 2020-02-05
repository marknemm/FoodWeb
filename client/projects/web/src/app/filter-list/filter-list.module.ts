import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FilterListContentComponent } from '~web/filter-list/filter-list-content/filter-list-content.component';
import { FilterListFiltersButtonsComponent } from '~web/filter-list/filter-list-filters-buttons/filter-list-filters-buttons.component';
import { FilterListFiltersTitleComponent } from '~web/filter-list/filter-list-filters-title/filter-list-filters-title.component';
import { FilterListFiltersComponent } from '~web/filter-list/filter-list-filters/filter-list-filters.component';
import { FilterListTitleComponent } from '~web/filter-list/filter-list-title/filter-list-title.component';
import { FilterListComponent } from '~web/filter-list/filter-list/filter-list.component';
import { SharedModule } from '~web/shared/shared.module';

@NgModule({
  declarations: [
    FilterListComponent,
    FilterListContentComponent,
    FilterListFiltersButtonsComponent,
    FilterListFiltersComponent,
    FilterListFiltersTitleComponent,
    FilterListTitleComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatTooltipModule,
    RouterModule.forChild([]),
    SharedModule
  ],
  exports: [
    FilterListComponent,
    FilterListContentComponent,
    FilterListFiltersButtonsComponent,
    FilterListFiltersComponent,
    FilterListFiltersTitleComponent,
    FilterListTitleComponent
  ]
})
export class FilterListModule {}