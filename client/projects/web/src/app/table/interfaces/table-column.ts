import { SelectionModel } from "@angular/cdk/collections";
import { TemplateRef } from "@angular/core";

/**
 * Defines metadata for a (FoodWeb) Table's columns.
 * @param T The optional type of the row data for the table.
 */
export interface TableColumn<T = any> {
  /**
   * The (property) name.
   */
  name: string;
  /**
   * The visible name. If not provided, then name is transformed into a visible name.
   * The transform will convert a camel case name into separate titlecase words.
   * It will also replace all underscores with spaces and make the resulting words titlecase.
   */
  visibleName?: string;
  /**
   * Whether or not the column should be sticky. Default is false.
   */
  sticky?: boolean;
  /**
   * Whether or not to disable sorting for the column. Default is false (for sorting enabled).
   */
  disableSort?: boolean;
  /**
   * Applies a custom class to the header cell for the column.
   */
  headerCellClass?: string;
  /**
   * Applies a custom class to the column's cells.
   */
  cellClass?: string;
  /**
   * Applies the custom template to the column's header cell.
   */
  headerCellTemplate?: TemplateRef<any>;
  /**
   * Applies the custom template to the column's cells.
   */
  cellTemplate?: TemplateRef<any>;
  /**
   * The width of the column as a CSS style string.
   */
  width?: string;
  /**
   * The min-width of the column as a CSS style string.
   */
  minWidth?: string;
  /**
   * Set to true if the header cell for the column should have a checkbox generated for it.
   * The generated checkbox will be placed before any text/template content.
   */
  headerCellCheckbox?: boolean;
  /**
   * Set to true if each cell within the column should have a checkbox generated for it.
   * The generated checkbox will be placed before any text/template content.
   */
  cellCheckbox?: boolean;
  /**
   * The value mappings to use for a cell checkbox's checked and unchecked states.
   * The values are mapped before any data transformation happnes for the cell.
   * By default, { checked: true, unchecked: false } is used.
   */
  cellCheckboxValueMap?: { checked: any, unchecked: any };
  /**
   * The selection model for column cell checkboxes. Will be automatically set and maintained by TableDataSource.
   */
  selectionModel?: SelectionModel<T>;
  /**
   * A callback method that shall be called whenever the column cells' checkboxes' checked-state changes.
   */
  cellCheckboxCb?: (row: T, name: string, checked: boolean) => void,
  /**
   * Applies a data transform function to the data that is to be displayed in a default cell template.
   * The function takes as input the row, and it should output the value to display in the cell.
   */
  dataTransform?: (row: T, name: string) => any;
}
