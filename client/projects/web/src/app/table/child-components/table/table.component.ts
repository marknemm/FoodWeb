import { SelectionChange } from '@angular/cdk/collections';
import { AfterContentInit, Component, ContentChild, ContentChildren, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, QueryList, SimpleChanges, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatColumnDef, MatFooterRowDef, MatHeaderRowDef, MatRowDef, MatTable } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TableColumn, TableDataSource, TableSelectionType } from '~web/table/interfaces/table-data-source';
export { TableColumn, TableDataSource, TableSelectionType };

@Component({
  selector: 'foodweb-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent<T = any> implements OnChanges, AfterContentInit, OnDestroy {

  /**
   * The datasource used for the table. If not set, will be auto-set by encompassing TableCOntainer component.
   */
  @Input() dataSource: TableDataSource<T>;
  /**
   * Set to false if the table header should not be sticky. Default is true.
   */
  @Input() stickyHeader = true;
  /**
   * Set to false if the table rows' action (button) column should not be sticky. Default is true.
   */
  @Input() stickyRowActions = true;

  /**
   * Emitted whenever there is a table row selection change. See Angular Material SelectionModel for details.
   */
  @Output() selectionChange = new EventEmitter<SelectionChange<T>>();

  @ContentChildren(MatHeaderRowDef) headerRowDefs: QueryList<MatHeaderRowDef>;
  @ContentChildren(MatRowDef) rowDefs: QueryList<MatRowDef<T>>;
  @ContentChildren(MatFooterRowDef) footerRowDefs: QueryList<MatFooterRowDef>;
  @ContentChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef>;
  @ContentChild('rowActionDef') rowActionDef: TemplateRef<any>;

  @ViewChild(MatTable) matTable: MatTable<T>;
  @ViewChild(MatTable, { read: ElementRef }) matTableElemRef: ElementRef<HTMLElement>;
  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatHeaderRowDef) defaultHeaderRowDef: MatHeaderRowDef;
  @ViewChild(MatRowDef) defaultRowDef: MatRowDef<T>;
  @ViewChildren(MatColumnDef) defaultColumnDefs: QueryList<MatColumnDef>;

  private _defaultStdColumns: TableColumn[] = [];
  private _columnNames: string[] = [];

  // Record previous/latest table definitions to remove them upon content change.
  private _prevHeaderRowDefs: MatHeaderRowDef[] = [];
  private _prevRowDefs: MatRowDef<T>[] = [];
  private _prevFooterRowDefs: MatFooterRowDef[] = [];
  private _prevColumnDefs: MatColumnDef[] = [];
  private _destroy$ = new Subject();

  constructor() {}

  get defaultStdColumns(): TableColumn[] {
    return this._defaultStdColumns;
  }

  get columnNames(): string[] {
    return this._columnNames;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataSource && this.dataSource) {
      // Subscribe to any structural changes for the table so we can rebuild definitions on change.
      this.dataSource.structureUpdate$.pipe(takeUntil(this._destroy$)).subscribe(this.refreshTableDefs.bind(this));
      if (this.dataSource.selectionModel) {
        this.dataSource.selectionModel.changed.pipe(takeUntil(this._destroy$)).subscribe(
          (change: SelectionChange<T>) => this.selectionChange.emit(change)
        );
      }
    }
  }

  ngAfterContentInit() {
    this.refreshTableDefs();
    // Listen for any changes in projected content related to angular material table definitions.
    this.columnDefs.changes.pipe(takeUntil(this._destroy$)).subscribe(this.refreshTableDefs.bind(this));
    this.headerRowDefs.changes.pipe(takeUntil(this._destroy$)).subscribe(this.refreshTableDefs.bind(this));
    this.rowDefs.changes.pipe(takeUntil(this._destroy$)).subscribe(this.refreshTableDefs.bind(this));
    this.footerRowDefs.changes.pipe(takeUntil(this._destroy$)).subscribe(this.refreshTableDefs.bind(this));
  }

  ngOnDestroy() {
    // Prevent rxjs memory leaks from ContentChildren subscriptions.
    this._destroy$.next();
  }

  /**
   * Refreshes the table's internal row, column, and cell definitions.
   */
  refreshTableDefs(): void {
    this._defaultStdColumns = this._findDefaultStdColumns();

    // Use timeout to allow Angular to process change in defaultColumns so that we can reference generated default column templates.
    setTimeout(() => {
      this._columnNames = this._genColumnNames();
      this._setColumnDefs();
      this._setHeaderRowDef();
      this._setRowDef();
      this._setFooterRowDef();
      this.matTable.renderRows();
    });
  }

  /**
   * Generates cell display and filter data by applying any transform if one exists for the containing column.
   * If a transform does not exist, then it simply uses the raw data from the containing row.
   * @param column The column (metadata) that the cell belongs to.
   * @param row The row (data) that the cell belongs to.
   * @return The generated cell display/filter value.
   */
  _genCellData(column: TableColumn, row: T): any {
    const cellData: any = (column.dataTransform ? column.dataTransform(row, column.name) : (<any>row)[column.name]);
    return (cellData != null ? cellData : '');
  }

  /**
   * Find all (default) columns that were not manually included as transcluded content.
   * @return The default columns.
   */
  private _findDefaultStdColumns(): TableColumn[] {
    return this.dataSource.columns.filter((col: TableColumn) =>
      !this.columnDefs.find((columnDef: MatColumnDef) => columnDef.name === col.name)
    );
  }

  /**
   * Generates the names of all of the columns that will be included in the table.
   * @return A list of the column names.
   */
  private _genColumnNames(): string[] {
    const columnNames: string[] = this.dataSource.columnNames;
    if (this.dataSource.selectionType === TableSelectionType.checkbox) {
      columnNames.unshift('checkbox');
    }
    if (this.rowActionDef) {
      columnNames.push('rowActions');
    }
    return columnNames;
  }

  /**
   * Sets the column definitions that will be used for the table. Will use any projected content for the column definitions first,
   * and if such projected content does not exist, then it will use default column definitions.
   */
  private _setColumnDefs(): void {
    this._prevColumnDefs.forEach((colDef: MatColumnDef) => this.matTable.removeColumnDef(colDef));

    const newColumnDefs: MatColumnDef[] = [];
    for (let i = 0; i < this.columnNames.length; i++) {
      newColumnDefs.push(
        this.columnDefs.find((colDef: MatColumnDef) => colDef.name === this.columnNames[i]) ||
        this.defaultColumnDefs.find((colDef: MatColumnDef) => colDef.name === this.columnNames[i])
      );
      this.matTable.addColumnDef(newColumnDefs[i]);
    }

    this._prevColumnDefs = newColumnDefs;
  }

  /**
   * Sets the footer row definition for the table. If projected footer row content exists, then it is used to generate the
   * footer row. If it does not exist, the default is no footer row.
   */
  private _setFooterRowDef(): void {
    this._prevFooterRowDefs.forEach((def: MatFooterRowDef) => this.matTable.removeFooterRowDef(def));
    this.footerRowDefs.forEach((def: MatFooterRowDef) => this.matTable.addFooterRowDef(def));
    this._prevFooterRowDefs = this.footerRowDefs.toArray();
  }

  /**
   * Sets the header row definition for the table. If projected header row content exists, then it is used to generate the header row(s).
   * If no projected content exists for the header row, then a default header row definition is used.
   */
  private _setHeaderRowDef(): void {
    const newHeaderRowDefs: MatHeaderRowDef[] = (this.headerRowDefs.first ? this.headerRowDefs.toArray() : [this.defaultHeaderRowDef]);
    this._prevHeaderRowDefs.forEach((def: MatHeaderRowDef) => this.matTable.removeHeaderRowDef(def));
    newHeaderRowDefs.forEach((def: MatHeaderRowDef) => this.matTable.addHeaderRowDef(def));
    this._prevHeaderRowDefs = newHeaderRowDefs;
  }

  /**
   * Sets the header row definition for the table. If projected row content exists, then it is used to generate the rows.
   * If no projected content exists for the rows, then a default row definition is used.
   */
  private _setRowDef(): void {
    const newRowDefs: MatRowDef<T>[] = (this.rowDefs.first ? this.rowDefs.toArray() : [this.defaultRowDef]);
    this._prevRowDefs.forEach((def: MatRowDef<T>) => this.matTable.removeRowDef(def));
    newRowDefs.forEach((def: MatRowDef<T>) => this.matTable.addRowDef(def));
    this._prevRowDefs = newRowDefs;
  }

}
