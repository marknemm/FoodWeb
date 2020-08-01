import { AfterViewInit, Component, ContentChildren, ElementRef, OnDestroy, QueryList } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TableDataSource } from '~web/table/interfaces/table-data-source';
import { TableTitleComponent } from '~web/table/child-components/table-title/table-title.component';
import { TableComponent } from '~web/table/child-components/table/table.component';

@Component({
  selector: 'foodweb-table-container,[foodweb-table-container]',
  templateUrl: './table-container.component.html',
  styleUrls: ['./table-container.component.scss']
})
export class TableContainerComponent<T = any> implements AfterViewInit, OnDestroy {

  @ContentChildren(TableTitleComponent, { descendants: true }) tableTitleQuery: QueryList<TableTitleComponent<T>>;
  @ContentChildren(TableComponent, { descendants: true }) tableQuery: QueryList<TableComponent<T>>;
  @ContentChildren(MatTable, { descendants: true }) matTableQuery: QueryList<MatTable<T>>;
  @ContentChildren(MatTable, { descendants: true, read: ElementRef }) matTableElemRefQuery: QueryList<ElementRef<HTMLElement>>;
  @ContentChildren(MatSort, { descendants: true }) matSortQuery: QueryList<MatSort>;
  @ContentChildren(MatPaginator, { descendants: true }) matPaginatorQuery: QueryList<MatPaginator>;

  dataSource: TableDataSource<T>;

  private _destroy$ = new Subject();

  ngAfterViewInit() {
    setTimeout(() => {
      this._handleContentUpdates();
      this.tableTitleQuery.changes.pipe(takeUntil(this._destroy$)).subscribe(this._handleContentUpdates.bind(this));
      this.tableQuery.changes.pipe(takeUntil(this._destroy$)).subscribe(this._handleContentUpdates.bind(this));
      this.matTableQuery.changes.pipe(takeUntil(this._destroy$)).subscribe(this._handleContentUpdates.bind(this));
      this.matTableElemRefQuery.changes.pipe(takeUntil(this._destroy$)).subscribe(this._handleContentUpdates.bind(this));
      this.matSortQuery.changes.pipe(takeUntil(this._destroy$)).subscribe(this._handleContentUpdates.bind(this));
      this.matPaginatorQuery.changes.pipe(takeUntil(this._destroy$)).subscribe(this._handleContentUpdates.bind(this));
    });
  }

  ngOnDestroy() {
    // Prevent RxJs memory leaks.
    this._destroy$.next();
  }

  private _handleContentUpdates(): void {
    const tableTitle: TableTitleComponent<T> = this.tableTitleQuery.first;
    const Table: TableComponent<T> = this.tableQuery.first;
    // Extract MatTable out of Table if using Table.
    const matTable: MatTable<T> = (Table ? Table.matTable : this.matTableQuery.first);
    const matTableElemRef: ElementRef<HTMLElement> = (Table ? Table.matTableElemRef : this.matTableElemRefQuery.first);
    const matSort: MatSort = this.matSortQuery.first;
    const matPaginator: MatPaginator = this.matPaginatorQuery.first;

    if (matTable) {
      this.dataSource = <TableDataSource<T>>matTable.dataSource;
      this._setupDataSource(tableTitle, matSort, matPaginator);
      this._wrapTableInContainer(matTableElemRef);
      this._setTableAria(tableTitle, matTableElemRef);
    }
  }

  /**
   * Connects the data source to various endpoints to enable add-on features for the table.
   */
  private _setupDataSource(tableTitle: TableTitleComponent<T>, matSort: MatSort, matPaginator: MatPaginator): void {
    if (tableTitle && tableTitle.dataSource !== this.dataSource) {
      tableTitle.dataSource = this.dataSource;
    }
    if (this.dataSource && this.dataSource.sort !== matSort) {
      this.dataSource.sort = matSort;
    }
    if (this.dataSource && this.dataSource.paginator !== matPaginator) {
      this.dataSource.paginator = matPaginator;
    }
  }

  /**
   * Wrap the table in a container for additional styling and to enable scrolling.
   */
  private _wrapTableInContainer(matTableElemRef: ElementRef<HTMLElement>): void {
    const datatableContainerClass = 'datatable-container';
    const matTableElem: HTMLElement = (matTableElemRef ? matTableElemRef.nativeElement : null);

    if (matTableElem && !matTableElem.parentElement.classList.contains(datatableContainerClass)) {
      const matTableElemParent: HTMLElement = matTableElem.parentElement;
      const datatableContainer: HTMLDivElement = document.createElement('div');
      datatableContainer.classList.add(datatableContainerClass);
      matTableElemParent.replaceChild(datatableContainer, matTableElem);
      datatableContainer.appendChild(matTableElem);
    }
  }

  /**
   * Set the aria attributes for the table for accessibility.
   */
  private _setTableAria(tableTitle: TableTitleComponent<T>, matTableElemRef: ElementRef<HTMLElement>): void {
    const matTableElem: HTMLElement = (matTableElemRef ? matTableElemRef.nativeElement : null);

    if (matTableElem && tableTitle && !matTableElem.getAttribute('aria-labelledby')) {
      matTableElem.setAttribute('aria-labelledby', tableTitle.titleId);
    }
  }

}
