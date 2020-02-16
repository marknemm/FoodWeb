import { Component, Input } from '@angular/core';
import { TableDataSource } from '~web/table/table-data-source';

@Component({
  selector: 'food-web-table-title',
  templateUrl: './table-title.component.html',
  styleUrls: ['./table-title.component.scss']
})
export class TableTitleComponent<T = any> {

  private static _idCounter = 0;

  /**
   * The table data source. Automatically set if placed inside of table-container component tag.
   */
  @Input() dataSource: TableDataSource<T>;
  /**
   * The optional ID applied to the table title text element.
   * Default is auto generated.
   */
  @Input() titleId = `table-title-${TableTitleComponent._idCounter++}`;
  /**
   * Determines whether or not to include a filter search field.
   * Default is true for include.
   */
  @Input() includeSearch = true;
  /**
   * The search placeholder. Default value is 'Search...'.
   */
  @Input() searchPlaceholder = 'Search...';
  /**
   * The current value to set in the contained search input.
   */
  @Input() searchValue = '';
  /**
   * The debounce time for the filter (in ms).
   * Default value is 0ms.
   */
  @Input() searchDebounceTime = 0;
  /**
   * Whether or not the default form members of the table title are disabled. Default is false.
   */
  @Input() disabled = false;
  /**
   * Whether or not the table filter input is collapsible. In desktop mode, hovering over the search icon will expand the input.
   * In mobile mode, tapping the search icon will expand the input. Default is true.
   */
  @Input() collapsibleFilter = true;
  /**
   * The icon used for the table search/filter.
   */
  @Input() searchIcon = 'search';

  /**
   * Flag to determine whether or not to show the search input.
   */
  private _showDatatableFilter = false;
  /**
   * Debounce timer used for updating rawFilteredRows in updateFilteredRows method below.
   */
  private _updateFiltTimer: any;

  get searchFilterVisible(): boolean {
    return (this._showDatatableFilter || !this.collapsibleFilter);
  }

  get searchFilterDisabled(): boolean {
    return (!this.dataSource || !this.dataSource.data || this.disabled || !this.searchFilterVisible);
  }

  /**
   * Invoked whenever the filter input field value updates.
   * @param event The filter input field update event.
   */
  updateFilter(event: { target: { value: string } }): void {
    clearTimeout(this._updateFiltTimer);
    this._updateFiltTimer = setTimeout(
      () => this.dataSource.filter = event.target.value.toLowerCase(),
      this.searchDebounceTime
    );
  }

  _onSearchFormFieldFocus(searchInput: HTMLInputElement): void {
    this._showDatatableFilter = true;
    searchInput.disabled = false;
    searchInput.click();
  }

  _onSearchFormFieldHover(): void {
    this._showDatatableFilter = true;
  }

  _recalcShowDatatableFilter(searchInput: HTMLInputElement): void {
    this._showDatatableFilter = (searchInput === document.activeElement || !!searchInput.value);
  }

}
