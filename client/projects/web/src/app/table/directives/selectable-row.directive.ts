import { Directive, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TableDataSource, TableSelectionType } from '~web/table/interfaces/table-data-source';
export { TableSelectionType };

@Directive({
  selector: '[foodwebSelectableRow]'
})
export class SelectableRowDirective<T = any> implements OnChanges {

  /**
   * The row object bound to the host row.
   */
  @Input('foodwebSelectableRow') row: T;
  /**
   * The data source for the host table.
   */
  @Input() dataSource: TableDataSource<T>;
  /**
   * Optionally set to true to disable selection of the host row.
   */
  @Input() disableSelect = false;

  ngOnChanges(changes: SimpleChanges) {
    // If changing from enabled to disabled, then make sure the host row is no longer selected
    if (changes.disableSelect && !changes.disableSelect.previousValue && this.disableSelect && this.dataSource.selectionModel) {
      this.dataSource.selectionModel.deselect(this.row);
    }
  }

  /**
   * Handles a row click. Should not be invoked externally.
   * @param row The row that was clicked
   */
  @HostListener('click', ['$event'])
  _onClick (event: MouseEvent): void {
    if (!this.disableSelect && this.dataSource.selectionModel && this.dataSource.selectionType !== TableSelectionType.checkbox) {
      const singleSel: boolean = this.dataSource.selectionType === TableSelectionType.single;
      const multiSelNoMod: boolean = this.dataSource.selectionType === TableSelectionType.multi && !event.ctrlKey && !event.metaKey;
      if (singleSel || multiSelNoMod) {
        this.dataSource.selectionModel.clear();
      }
      this.dataSource.selectionModel.select(this.row);
    }
  }

}
