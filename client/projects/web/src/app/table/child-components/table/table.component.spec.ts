import { SelectionModel } from '@angular/cdk/collections';
import { QueryList } from '@angular/core';
import { async, ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatColumnDef, MatTableModule } from '@angular/material/table';
import { MockComponent, MockDirective } from 'ng-mocks';
import { Subject } from 'rxjs';
import { SelectableRowDirective } from '~web/table/selectable-row/selectable-row.directive';
import { TableCheckboxComponent } from '../table-checkbox/table-checkbox.component';
import { TableComponent, TableSelectionType } from './table.component';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TableComponent,
        MockDirective(SelectableRowDirective),
        MockComponent(TableCheckboxComponent),
        MockComponent(MatCheckbox)
      ],
      imports: [
        MatTableModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    component.dataSource = <any> {
      columns: [
        { name: 'prop1', visibleName: 'Prop1' },
        { name: 'prop2', visibleName: 'Prop2' },
        { name: 'prop3', visibleName: 'Prop3' }
      ],
      columnNames: ['prop1', 'prop2', 'prop3'],
      data: [
        { prop1: 'a', prop2: 'b', prop3: 'c' },
        { prop1: 'd', prop2: 'e', prop3: 'f' }
      ],
      structureUpdate$: new Subject<void>(),
      edit$: new Subject<any>(),
      delete$: new Subject<any>(),
      editConfig: { edit: false, delete: false }
    };
    fixture.detectChanges();
    spyOn(component.matTable, 'addColumnDef');
    spyOn(component.matTable, 'addHeaderRowDef');
    spyOn(component.matTable, 'addRowDef');
    spyOn(component.matTable, 'addFooterRowDef');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to structural updates on data source', () => {
    spyOn(component, 'refreshTableDefs');
    component.ngOnChanges({ dataSource: <any>{} });
    component.dataSource.structureUpdate$.next();
    expect(component.refreshTableDefs).toHaveBeenCalled();
  });

  describe('Default columns, header row, and row definitions', () => {

    beforeEach(fakeAsync(() => {
      component.ngAfterContentInit();
      flush();
    }));

    it('should have set all columns as default columns', () => {
      expect(component.defaultStdColumns).toEqual(component.dataSource.columns);
    });

    it('should have correctly added default column definitions in material table', () => {
      expect(component.matTable.addColumnDef).toHaveBeenCalledTimes(3);
      for (let i = 0; i < component.dataSource.columns.length; i++) {
        expect(component.matTable.addColumnDef).toHaveBeenCalledWith(
          component.defaultColumnDefs.find((colDef: MatColumnDef) => colDef.name === component.dataSource.columns[i].name)
        );
      }
    });

    it('should have correctly set the default header row definition in material table', () => {
      expect(component.matTable.addHeaderRowDef).toHaveBeenCalledWith(component.defaultHeaderRowDef);
    });

    it('should have correctly set the default row definition in material table', () => {
      expect(component.matTable.addRowDef).toHaveBeenCalledWith(component.defaultRowDef);
    });

    it('should not have set the footer row definition in material table', () => {
      expect(component.matTable.addFooterRowDef).not.toHaveBeenCalled();
    });
  });

  describe('Default & custom columns, custom header row, custom row, and custom footer definitions', () => {

    beforeEach(fakeAsync(() => {
      component.headerRowDefs = new QueryList<any>();
      component.headerRowDefs.reset([<any>{}]);
      component.rowDefs = new QueryList<any>();
      component.rowDefs.reset([<any>{}]);
      component.footerRowDefs = new QueryList<any>();
      component.footerRowDefs.reset([<any>{}]);
      component.columnDefs = new QueryList<any>();
      component.columnDefs.reset([<any>{ name: 'prop2' }]);
      component.ngAfterContentInit();
      flush();
    }));

    it('should have set prop1 & prop3 columns as default columns', () => {
      expect(component.defaultStdColumns).toEqual([component.dataSource.columns[0], component.dataSource.columns[2]]);
    });

    it('should have correctly added default and custom column definitions in material table', () => {
      expect(component.matTable.addColumnDef).toHaveBeenCalledTimes(3);
      for (let i = 0; i < component.dataSource.columns.length; i++) {
        expect(component.matTable.addColumnDef).toHaveBeenCalledWith(
          component.columnDefs.find((colDef: MatColumnDef) => colDef.name === component.dataSource.columns[i].name) ||
          component.defaultColumnDefs.find((colDef: MatColumnDef) => colDef.name === component.dataSource.columns[i].name)
        );
      }
    });

    it('should have correctly set the custom header row definition in material table', () => {
      expect(component.matTable.addHeaderRowDef).toHaveBeenCalledWith(component.headerRowDefs.first);
    });

    it('should have correctly set the custom row definition in material table', () => {
      expect(component.matTable.addRowDef).toHaveBeenCalledWith(component.rowDefs.first);
    });

    it('should have correctly set the custom footer row definition in material table', () => {
      expect(component.matTable.addFooterRowDef).toHaveBeenCalledWith(component.footerRowDefs.first);
    });
  });

  describe('Checkbox selection', () => {

    beforeEach(fakeAsync(() => {
      component.dataSource.selectionType = TableSelectionType.checkbox;
      (<any>component.dataSource.selectionModel) = new SelectionModel(true);
      component.ngAfterContentInit();
      flush();
    }));

    it('should have correctly added default column definitions in material table', () => {
      expect(component.matTable.addColumnDef).toHaveBeenCalledTimes(4);
      expect(component.matTable.addColumnDef).toHaveBeenCalledWith(
        component.defaultColumnDefs.find((colDef: MatColumnDef) => colDef.name === 'checkbox')
      );
      for (let i = 1; i < component.dataSource.columns.length; i++) {
        expect(component.matTable.addColumnDef).toHaveBeenCalledWith(
          component.defaultColumnDefs.find((colDef: MatColumnDef) => colDef.name === component.dataSource.columns[i].name)
        );
      }
    });

    it('should emit selection change on selection model change', () => {
      spyOn(component.selectionChange, 'emit');
      component.ngOnChanges(<any>{ dataSource: {} });
      component.dataSource.selectionModel.onChange.next(<any>'abc');
      expect(component.selectionChange.emit).toHaveBeenCalledWith('abc');
    });
  });

  describe('On rowActions template content projection', () => {

    beforeEach(fakeAsync(() => {
      component.rowActionDef = <any>{};
      component.ngAfterContentInit();
      flush();
    }));

    it('should have correctly added rowActions column definition to table', () => {
      expect(component.matTable.addColumnDef).toHaveBeenCalledTimes(4);
      for (let i = 0; i < component.dataSource.columns.length - 1; i++) {
        expect(component.matTable.addColumnDef).toHaveBeenCalledWith(
          component.defaultColumnDefs.find((colDef: MatColumnDef) => colDef.name === component.dataSource.columns[i].name)
        );
      }
      expect(component.matTable.addColumnDef).toHaveBeenCalledWith(
        component.defaultColumnDefs.find((colDef: MatColumnDef) => colDef.name === 'rowActions')
      );
    });
  });

  describe('On generate cell data', () => {

    it('should generate default cell data', () => {
      const data: string = component._genCellData(<any>{ name: 'col1' }, { col1: 'abc' });
      expect(data).toEqual('abc');
    });

    it('should generate custom cell data', () => {
      const data: string = component._genCellData(<any>{ name: 'col1', dataTransform: (row: any) => row.col1 + 'd'}, { col1: 'abc' });
      expect(data).toEqual('abcd');
    });
  });
});
