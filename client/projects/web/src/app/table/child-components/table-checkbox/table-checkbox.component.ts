import { SelectionModel } from '@angular/cdk/collections';
import { Component, DoCheck, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableColumn, TableDataSource } from '~web/table/table-data-source';

@Component({
  selector: 'food-web-table-checkbox',
  templateUrl: './table-checkbox.component.html',
  styleUrls: ['./table-checkbox.component.scss']
})
export class TableCheckboxComponent<T = any> implements OnInit, DoCheck {

  /**
   * The table data source used to maintain row selection state.
   */
  @Input() dataSource: TableDataSource<T>;
  /**
   * The row that the checkbox belongs to. If not set, then it is assumed that this is a header cell checkbox used for check/uncheck all functionality.
   */
  @Input() row: T;
  /**
   * The column that the checkbox belongs to. If set, then the checkbox will belong to a column and will be used for property state update.
   * If not set, then the checkbox will belong to a row for row selection.
   */
  @Input() column: TableColumn<T>;

  // tslint:disable-next-line:no-input-rename
  @Input('attr.aria-label') ariaLabel: string;
  // tslint:disable-next-line:no-input-rename
  @Input('attr.aria-labelledby') ariaLabelledby: string;

  /**
   * Emitted whenever the contained checkbox's checked state changes.
   */
  @Output() change = new EventEmitter<boolean>();

  private _selectionModel: SelectionModel<any>;

  /**
   * The selection model that holds the state for the checkboxes belonging either to a column (for individual property state update)
   * or row (for the purpose of row selection).
   */
  get selectionModel(): SelectionModel<any> {
    return this._selectionModel;
  }

  ngOnInit() {
    if (!this.dataSource) {
      throw new Error('Table checkbox missing required dataSource input data binding');
    }
    this._selectionModel = (this.column ? this.column.selectionModel : this.dataSource.selectionModel);
  }

  /**
   * During each change detection cycle, for a checkbox that belongs to a column cell, check if the cell's value
   * maches the checked value mapping. If so, set the selection model appropriately.
   */
  ngDoCheck() {
    if (this.row && this.column) {
      const isSelected: boolean = this.column.selectionModel.isSelected(this.row);
      if ((<any>this.row)[this.column.name] === this.column.cellCheckboxValueMap.checked) {
        if (!isSelected) {
          setTimeout(() => this.column.selectionModel.select(this.row));
        }
      } else if (isSelected) {
        setTimeout(() => this.column.selectionModel.deselect(this.row));
      }
    }
  }

  /**
   * Used when the selection type is 'checkbox'. Determines if all table rows have been selected.
   * @return true if they have been selected, false if not.
   */
  isAllSelected(): boolean {
    const numSelected = this.selectionModel.selected.length;
    const numRows = this.dataSource.data.length;
    return (numSelected === numRows);
  }

  /**
   * Used when the selection type is 'checkbox'. Toggles the selection of all rows.
   */
  toggleSelectAll(): void {
    const allSelected: boolean = this.isAllSelected();
    allSelected ?
      this.selectionModel.clear() :
      this.selectionModel.select(...this.dataSource.data);
    if (this.column) {
      this.dataSource.data.forEach((row: T) => this._handleColumnCheckboxUpdt(row));
    }
    this.change.emit(allSelected);
  }

  /**
   * Handles the change event of the contained checkbox form control.
   */
  _onChanged(): void {
    this.selectionModel.toggle(this.row);
    if (this.column && this.column.cellCheckbox) {
      this._handleColumnCheckboxUpdt(this.row);
    }
    this.change.emit(this.selectionModel.isSelected(this.row));
  }

  /**
   * Handles the update of a column checkbox's checked state.
   * @param row The row containing the checkbox that was updated.
   */
  private _handleColumnCheckboxUpdt(row: T): void {
    let valueUpdt = this.selectionModel.isSelected(row);

    // If we have cell checkbox value mappings, then get the update value from these.
    if (this.column.cellCheckboxValueMap) {
      const checkedStr: string = (valueUpdt ? 'checked' : 'unchecked');
      valueUpdt = (<any>this.column.cellCheckboxValueMap)[checkedStr];
    }

    (<any>row)[this.column.name] = valueUpdt;
    if (this.column.cellCheckboxCb) {
      this.column.cellCheckboxCb(row, this.column.name, valueUpdt);
    }
  }

}
