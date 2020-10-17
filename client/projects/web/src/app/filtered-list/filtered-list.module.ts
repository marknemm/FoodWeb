import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { SharedModule } from '~web/shared/shared.module';
import { FilteredListContentComponent } from './child-components/filtered-list-content/filtered-list-content.component';
import { FilteredListTitleComponent } from './child-components/filtered-list-title/filtered-list-title.component';
import { FilteredListToolbarComponent } from './child-components/filtered-list-toolbar/filtered-list-toolbar.component';
import { FilteredListComponent } from './child-components/filtered-list/filtered-list.component';
import { ListFiltersFooterComponent } from './child-components/list-filters-footer/list-filters-footer.component';
import { ListFiltersTitleComponent } from './child-components/list-filters-title/list-filters-title.component';
import { ListFiltersComponent } from './child-components/list-filters/list-filters.component';
import { ListSortComponent } from './child-components/list-sort/list-sort.component';

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
