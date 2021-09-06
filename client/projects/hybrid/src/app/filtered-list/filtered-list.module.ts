import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FilteredListModule as WebFilteredListModule } from '~web/filtered-list/filtered-list.module';
import { FilteredListComponent } from './child-components/filtered-list/filtered-list.component';
import { ListPageDirective } from './directives/list-page.directive';

@NgModule({
  declarations: [
    FilteredListComponent,
    ListPageDirective,
  ],
  imports: [
    CommonModule,
    IonicModule,
    WebFilteredListModule,
  ],
  exports: [
    WebFilteredListModule,
    FilteredListComponent,
    ListPageDirective,
  ]
})
export class FilteredListModule {}
