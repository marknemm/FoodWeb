import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { TableColumn } from '~web/table/table-column';
export { TableColumn };

/**
 * The selection type for the (FoodWeb) Table.
 */
export enum TableSelectionType {
  single = 'single',
  multi = 'multi',
  checkbox = 'checkbox'
}

export class TableDataSource<T> extends MatTableDataSource<T> {

  /**
   * Emitted whenever the (meta) structure of the table changes.
   * Such a change may entail resetting the column or selectionModel property.
   */
  structureUpdate$ = new Subject<void>();
  /**
   * Emits when a row should be added.
   */
  add$ = new Subject<void>();
  /**
   * Emits row that should be edited.
   */
  edit$ = new Subject<T>();
  /**
   * Emits row that should be deleted.
   */
  delete$ = new Subject<T>();

  private _columns: TableColumn[];
  private _selectionType: TableSelectionType;
  private _selectionModel: SelectionModel<T>;

  constructor(
    data: T[] = [],
    columns: (TableColumn | string)[] = [],
    selectionType?: TableSelectionType
  ) {
    super(data);
    this.columns = this._convertStrColumnsToObjs(columns);
    this.selectionType = selectionType;
    this.filterPredicate = this._filterPredicate.bind(this);
  }

  /**
   * The raw names of the (FoodWeb) Table Columns that make up the table's structure.
   */
  get columnNames(): string[] {
    return this._columns.map((col: TableColumn) => col.name);
  }

  /**
   * The (FoodWeb) Table Columns that make up the table's structure.
   */
  get columns(): TableColumn[] {
    return this._columns;
  }

  set columns(cols: TableColumn[]) {
    // Try to generate any missing names from the present column properties.
    for (let i = 0; i < cols.length; i++) {
      if (cols[i].visibleName === undefined) {
        this._initColumnVisibleName(cols[i]);
      }
      if (!cols[i].cellCheckboxValueMap) {
        cols[i].cellCheckboxValueMap = { checked: true, unchecked: false };
      }
      cols[i].selectionModel = new SelectionModel<T>(true);
    }
    this._columns = cols;
    this.structureUpdate$.next();
  }

  /**
   * The selection model for the table. Contributes to the structure of the table.
   * Will be configured based off of whatever selectionType is set to.
   */
  get selectionModel(): SelectionModel<T> {
    return this._selectionModel;
  }

  /**
   * The selection type for the table. Will implicitly generate and configure a selection model when set.
   */
  get selectionType(): TableSelectionType {
    return this._selectionType;
  }

  set selectionType(selType: TableSelectionType) {
    this._selectionType = selType;
    this._selectionModel = selType ?
      new SelectionModel<T>(selType !== TableSelectionType.single) :
      null;
    this.structureUpdate$.next();
  }

  /**
   * Converts any string column names in the given columns list to TableColumn objects.
   * @param columns List of columns to convert. Can be a mix of TableColumn objects and string column names.
   * @return A list composed purely of TableColumn objects.
   */
  private _convertStrColumnsToObjs(columns: (TableColumn | string)[]): TableColumn[] {
    return columns.map(
      (column: TableColumn | string) =>
        (typeof column === 'string') ? { name: column } : column
    );
  }

  /**
   * Custom filter predicate that takes into account data transform function definitions for each column.
   * @param row The row to test.
   * @param filter The filter string.
   * @return true if the row should be include, false if it should be exlcuded.
   */
  private _filterPredicate(row: T, filter: string): boolean {
    let rowPropConcat = '';
    this.columns.forEach((column: TableColumn) => {
      const columnData = (column.dataTransform ? column.dataTransform(row, column.name) : (<any>row)[column.name]);
      rowPropConcat += (columnData ? columnData.toString() + ' ' : '');
    });
    return (rowPropConcat.toLowerCase().indexOf(filter.toLowerCase()) >= 0);
  }

  private _initColumnVisibleName(column: TableColumn<T>): void {
    column.visibleName = column.name.replace(/([A-Z][a-z]|[0-9]+)/g, ' $1').replace(/([A-Z]{2,})/g, ' $1').replace('_', ' ');
    column.visibleName = column.visibleName.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.substr(1)).join(' ').trim();
  }

}
