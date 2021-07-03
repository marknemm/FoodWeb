import { QueryList } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { MatTableDataSource } from '@angular/material/table';
import { TableContainerComponent } from './table-container.component';

describe('TableContainerComponent', () => {
  let component: TableContainerComponent;
  let fixture: ComponentFixture<TableContainerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TableContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set dataSource of tableTitle', fakeAsync(() => {
    component.matTableQuery = new QueryList();
    component.matTableQuery.reset([<any>{ dataSource: {} }]);
    component.tableTitleQuery = new QueryList();
    component.tableTitleQuery.reset([<any>{ dataSource: null }]);
    component.ngAfterViewInit();
    flush();
    expect(component.tableTitleQuery.first.dataSource).toBe(<any>component.matTableQuery.first.dataSource);
  }));

  it('should set dataSource sort', fakeAsync(() => {
    component.matTableQuery = new QueryList();
    component.matTableQuery.reset([<any>{ dataSource: { sort: null } }]);
    component.matSortQuery = new QueryList();
    component.matSortQuery.reset([<any>{}]);
    component.ngAfterViewInit();
    flush();
    expect((<MatTableDataSource<any>>component.matTableQuery.first.dataSource).sort).toBe(<any>component.matSortQuery.first);
  }));

  it('should set dataSource paginator', fakeAsync(() => {
    component.matTableQuery = new QueryList();
    component.matTableQuery.reset([<any>{ dataSource: { paginator: null } }]);
    component.matPaginatorQuery = new QueryList();
    component.matPaginatorQuery.reset([<any>{}]);
    component.ngAfterViewInit();
    flush();
    expect((<MatTableDataSource<any>>component.matTableQuery.first.dataSource).paginator).toBe(<any>component.matPaginatorQuery.first);
  }));

  it('should wrap the material table element in datatable container div', fakeAsync(() => {
    const mockMatTableParentElem: HTMLElement = document.createElement('div');
    const mockMatTableElem: HTMLElement = document.createElement('div');
    mockMatTableParentElem.appendChild(mockMatTableElem);
    component.matTableElemRefQuery = new QueryList();
    component.matTableElemRefQuery.reset([{ nativeElement: mockMatTableElem }]);
    component.matTableQuery = new QueryList();
    component.matTableQuery.reset([<any>{ dataSource: {} }]);
    component.ngAfterViewInit();
    flush();
    expect(mockMatTableElem.parentElement.classList.contains('datatable-container')).toEqual(true);
  }));

  it('should set aria-labelledby attribute of table to table title ID', fakeAsync(() => {
    const mockMatTableParentElem: HTMLElement = document.createElement('div');
    const mockMatTableElem: HTMLElement = document.createElement('div');
    mockMatTableParentElem.appendChild(mockMatTableElem);
    component.matTableElemRefQuery = new QueryList();
    component.matTableElemRefQuery.reset([{ nativeElement: mockMatTableElem }]);
    component.matTableQuery = new QueryList();
    component.matTableQuery.reset([<any>{ dataSource: {} }]);
    component.tableTitleQuery = new QueryList();
    component.tableTitleQuery.reset([<any>{ titleId: 'titleId' }]);
    component.ngAfterViewInit();
    flush();
    expect(mockMatTableElem.getAttribute('aria-labelledby')).toEqual('titleId');
  }));

  it('should extract material table from (FoodWeb) table', fakeAsync(() => {
    component.tableQuery = new QueryList();
    component.tableQuery.reset([
      <any>{
        matTable: <any>{ dataSource: {} },
        matTableElemRef: null
      }
    ]);
    component.ngAfterViewInit();
    flush();
    expect(component.dataSource).toEqual(<any>component.tableQuery.first.matTable.dataSource);
  }));
});
