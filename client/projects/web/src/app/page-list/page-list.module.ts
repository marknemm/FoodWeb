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
import { PageListFiltersFooterComponent } from './child-components/page-list-filters-footer/page-list-filters-footer.component';
import { PageListFiltersTitleComponent } from './child-components/page-list-filters-title/page-list-filters-title.component';
import { PageListFiltersComponent } from './child-components/page-list-filters/page-list-filters.component';
import { PageListSortComponent } from './child-components/page-list-sort/page-list-sort.component';
import { PageListToolbarComponent } from './child-components/page-list-toolbar/page-list-toolbar.component';
import { PageListComponent } from './child-components/page-list/page-list.component';

@NgModule({
  declarations: [
    PageListComponent,
    PageListFiltersComponent,
    PageListFiltersFooterComponent,
    PageListFiltersTitleComponent,
    PageListSortComponent,
    PageListToolbarComponent,
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
    SharedModule,
  ],
  exports: [
    PageListComponent,
    PageListFiltersComponent,
    PageListFiltersFooterComponent,
    PageListFiltersTitleComponent,
    PageListSortComponent,
    PageListToolbarComponent,
  ]
})
export class PageListModule {}
