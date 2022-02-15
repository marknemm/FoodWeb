import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PageListModule as WebPageListModule } from '~web/page-list/page-list.module';
import { PageListFiltersFooterComponent } from './child-components/page-list-filters-footer/page-list-filters-footer.component';
import { PageListFiltersSectionComponent } from './child-components/page-list-filters-section/page-list-filters-section.component';
import { PageListSortComponent } from './child-components/page-list-sort/page-list-sort.component';
import { PageListComponent } from './child-components/page-list/page-list.component';

@NgModule({
  declarations: [
    PageListComponent,
    PageListFiltersFooterComponent,
    PageListFiltersSectionComponent,
    PageListSortComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    WebPageListModule,
  ],
  exports: [
    WebPageListModule,
    PageListComponent,
    PageListFiltersFooterComponent,
    PageListFiltersSectionComponent,
    PageListSortComponent,
  ]
})
export class PageListModule {}
