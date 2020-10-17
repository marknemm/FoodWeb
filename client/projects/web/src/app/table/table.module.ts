import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '~web/shared/shared.module';
import { TableAddComponent } from './child-components/table-add/table-add.component';
import { TableCheckboxComponent } from './child-components/table-checkbox/table-checkbox.component';
import { TableContainerComponent } from './child-components/table-container/table-container.component';
import { TableDeleteComponent } from './child-components/table-delete/table-delete.component';
import { TableEditComponent } from './child-components/table-edit/table-edit.component';
import { TableTitleComponent } from './child-components/table-title/table-title.component';
import { TableComponent } from './child-components/table/table.component';
import { SelectableRowDirective } from './directives/selectable-row.directive';

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
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
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
