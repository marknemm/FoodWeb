import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableDataSource } from '~web/table/interfaces/table-data-source';
export { TableDataSource };

@Component({
  selector: 'foodweb-table-edit',
  templateUrl: './table-edit.component.html',
  styleUrls: ['./table-edit.component.scss']
})
export class TableEditComponent<T = any> implements OnInit {

  @Input() dataSource: TableDataSource<T>;
  @Input() row: T;
  @Input() disabled = false;
  @Input() buttonText = 'Edit Row';
  @Input() tooltip: string;
  @Input() responsive = false;
  // tslint:disable-next-line:no-input-rename
  @Input('attr.aria-label') ariaLabel: string;
  // tslint:disable-next-line:no-input-rename
  @Input('attr.aria-labelledby') ariaLabelledby: string;

  @Output() edit = new EventEmitter<T>();

  constructor() {}

  ngOnInit() {
    if (this.tooltip === undefined) {
      this.tooltip = (this.buttonText) ? this.buttonText : 'Edit Row';
    }
    this.ariaLabel = (this.ariaLabel || this.ariaLabelledby) ? this.ariaLabel : this.tooltip;
  }

  /**
   * Handles the click of the edit button.
   */
  _onClick(): void {
    if (this.dataSource) {
      this.dataSource.edit$.next(this.row);
    }
    this.edit.emit(this.row);
  }

}
