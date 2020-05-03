import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FilteredListContentComponent } from '~web/filtered-list/filtered-list-content/filtered-list-content.component';
import { ListFiltersFooterComponent } from '~web/filtered-list/list-filters-footer/list-filters-footer.component';
import { ListSortComponent } from '~web/filtered-list/list-sort/list-sort.component';
import { ListFiltersTitleComponent } from '~web/filtered-list/list-filters-title/list-filters-title.component';
import { ListFiltersComponent } from '~web/filtered-list/list-filters/list-filters.component';
import { FilteredListTitleComponent } from '~web/filtered-list/filtered-list-title/filtered-list-title.component';
import { FilteredListToolbarComponent } from '~web/filtered-list/filtered-list-toolbar/filtered-list-toolbar.component';
import { FilteredListComponent } from '~web/filtered-list/filtered-list/filtered-list.component';
import { SharedModule } from '~web/shared/shared.module';

@NgModule({
  declarations: [
    FilteredListComponent,
    FilteredListContentComponent,
    ListFiltersFooterComponent,
    ListFiltersComponent,
    ListSortComponent,
    ListFiltersTitleComponent,
    FilteredListTitleComponent,
    FilteredListToolbarComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSidenavModule,
    MatTooltipModule,
    ReactiveFormsModule,
    RouterModule.forChild([]),
    SharedModule
  ],
  exports: [
    FilteredListComponent,
    FilteredListContentComponent,
    ListFiltersFooterComponent,
    ListFiltersComponent,
    ListSortComponent,
    ListFiltersTitleComponent,
    FilteredListTitleComponent,
    FilteredListToolbarComponent
  ]
})
export class FilteredListModule {}
