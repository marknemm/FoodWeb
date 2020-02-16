import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';
import { SelectableRowDirective } from '~web/table/selectable-row.directive';
import { TableAddComponent } from '~web/table/table-add/table-add.component';
import { TableCheckboxComponent } from '~web/table/table-checkbox/table-checkbox.component';
import { TableContainerComponent } from '~web/table/table-container/table-container.component';
import { TableDeleteComponent } from '~web/table/table-delete/table-delete.component';
import { TableEditComponent } from '~web/table/table-edit/table-edit.component';
import { TableTitleComponent } from '~web/table/table-title/table-title.component';
import { TableComponent } from '~web/table/table/table.component';

@NgModule({
  declarations: [
    SelectableRowDirective,
    TableAddComponent,
    TableCheckboxComponent,
    TableComponent,
    TableContainerComponent,
    TableDeleteComponent,
    TableEditComponent,
    TableTitleComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MatSortModule,
    MatTableModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    MatSortModule,
    MatTableModule,
    SelectableRowDirective,
    TableAddComponent,
    TableCheckboxComponent,
    TableComponent,
    TableContainerComponent,
    TableDeleteComponent,
    TableEditComponent,
    TableTitleComponent
  ]
})
export class TableModule {}
