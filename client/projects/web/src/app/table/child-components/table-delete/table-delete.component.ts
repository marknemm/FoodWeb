import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ConfirmDialogService } from '~web/shared/confirm-dialog/confirm-dialog.service';
import { TableDataSource } from '~web/table/table-data-source';
export { TableDataSource };

@Component({
  selector: 'food-web-table-delete',
  templateUrl: './table-delete.component.html',
  styleUrls: ['./table-delete.component.scss']
})
export class TableDeleteComponent<T = any> implements OnInit {

  /**
   * The data source for the table that contains the button.
   */
  @Input() dataSource: TableDataSource<T>;
  /**
   * The row that contains the button.
   */
  @Input() row: T;
  /**
   * Whether or not the button is disabled.
   * Default is false.
   */
  @Input() disabled = false;
  /**
   * The text to display on the responsive large screen (1200px) button.
   * Default value is 'Delete Row'.
   */
  @Input() buttonText = 'Delete Row';
  /**
   * The tooltip that is displayed when hovering over the icon only button.
   * If not set, then the buttonText input value is used if it exists.
   * If the buttonText value does not exist, then 'Delete Row' is used as default.
   */
  @Input() tooltip: string;
  /**
   * Set to true to make the delete button responsive. A responsive delete button will contain the
   * trash-bin icon and text on a large (desktop) screen. Once the screen size goes below the large
   * (1200px) threshold, it will only contain the trash-bin icon. Default value is false.
   */
  @Input() responsive = false;
  /**
   * The title used for the delete confirmation dialog box. Default is 'Delete Confirmation'.
   */
  @Input() confirmTitle = 'Delete Confirmation';
  /**
   * The message (body) used for the delete confirmation dialog box. Default is 'Are you sure you wish to delete this row?'.
   * If set to null, the the delete confirmation dialog will not show, and the delete will automatially proceed.
   */
  @Input() confirmMessage = 'Are you sure you wish to delete this row?';

  /**
   * Emits the row that is to be deleted whenever the delete button has been pushed and confirmed.
   */
  @Output() delete = new EventEmitter<T>();

  // tslint:disable-next-line:no-input-rename
  @Input('attr.aria-label') ariaLabel: string;
  // tslint:disable-next-line:no-input-rename
  @Input('attr.aria-labelledby') ariaLabelledby: string;

  constructor(
    private _confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit() {
    if (this.tooltip === undefined) {
      this.tooltip = (this.buttonText) ? this.buttonText : 'Delete Row';
    }
    this.ariaLabel = (this.ariaLabel || this.ariaLabelledby) ? this.ariaLabel : this.tooltip;
  }

  /**
   * Handles the click of the delete button.
   */
  _onClick(): void {
    const confirm$ = this._genConfirmObs();
    confirm$.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this._emitDelete();
      }
    });
  }

  /**
   * Generates a delete confirmation observable based on the value of confirmMessage.
   * @return If confirmMessage is truthy, then a confirm dialog is opened with its result returned as the observable.
   * Else an observable that immediately emits true is returned.
   */
  private _genConfirmObs(): Observable<boolean> {
    return this.confirmMessage ?
      this._confirmDialog.displayConfirmDialog(this.confirmTitle, this.confirmMessage) :
      of(true);
  }

  /**
   * Emits the delete event.
   */
  private _emitDelete(): void {
    if (this.dataSource) {
      this.dataSource.delete$.next(this.row);
    }
    this.delete.emit(this.row);
  }

}