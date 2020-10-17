import { SelectionModel } from '@angular/cdk/collections';
import { async, ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { MatCheckbox } from '@angular/material/checkbox';
import { MockComponent } from 'ng-mocks';
import { TableSelectionType } from '~web/table/interfaces/table-data-source';
import { TableCheckboxComponent } from './table-checkbox.component';

describe('TableCheckboxComponent', () => {
  let component: TableCheckboxComponent;
  let fixture: ComponentFixture<TableCheckboxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TableCheckboxComponent,
        MockComponent(MatCheckbox)
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableCheckboxComponent);
    component = fixture.componentInstance;
    component.dataSource = <any> {
      data: [
        { prop1: 'a', prop2: 'b', prop3: 'c' },
        { prop1: 'd', prop2: 'e', prop3: 'f' }
      ],
      selectionType: TableSelectionType.checkbox,
      selectionModel: new SelectionModel(true),
      columns: [{
        name: 'prop1',
        visibleName: 'Prop 1',
        headerCellCheckbox: true,
        cellCheckbox: true,
        selectionModel: new SelectionModel(true),
        cellCheckboxValueMap: { checked: 'a', unchecked: 'd' },
        cellCheckboxCb: () => {}
      }]
    };
    spyOn(component.dataSource.columns[0], 'cellCheckboxCb');
    component.row = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should throw error on init when not provided with dataSource input binding', () => {
    component.dataSource = null;
    expect(() => component.ngOnInit()).toThrow();
  });

  describe('Row selection checkbox', () => {

    it('should correctly check if all rows are selected', () => {
      expect(component.isAllSelected()).toEqual(false);
      component.dataSource.data.forEach((row: any) => component.dataSource.selectionModel.select(row));
      expect(component.isAllSelected()).toEqual(true);
    });

    it('should correctly toggle all to selected', () => {
      component.toggleSelectAll();
      expect(component.dataSource.selectionModel.selected.length).toEqual(component.dataSource.data.length);
    });

    it('should correctly toggle all to deselected', () => {
      component.dataSource.data.forEach((row: any) => component.dataSource.selectionModel.select(row));
      component.toggleSelectAll();
      expect(component.dataSource.selectionModel.selected.length).toEqual(0);
    });
  });

  describe('Column cell value checkbox', () => {

    beforeEach(() => {
      component.column = component.dataSource.columns[0];
      component.column.selectionModel.clear();
      component.ngOnInit();
    });

    it('should correclty set selection model on init', () => {
      expect(component.selectionModel).toEqual(component.column.selectionModel);
    });

    it('should correctly set selected on change detection cycle when cell data value equals checked value', fakeAsync(() => {
      spyOn(component.column.selectionModel, 'select');
      component.row = component.dataSource.data[0]; // Should be checked 'a'.
      component.ngDoCheck();
      flush();
      expect(component.column.selectionModel.select).toHaveBeenCalledWith(component.row);
    }));

    it('should correctly set unselected on change detection cycle when cell data value equals unchecked value', fakeAsync(() => {
      spyOn(component.column.selectionModel, 'deselect');
      component.row = component.dataSource.data[1]; // Should be unchecked 'd'.
      component.column.selectionModel.select(component.row);
      component.ngDoCheck();
      flush();
      expect(component.column.selectionModel.deselect).toHaveBeenCalledWith(component.row);
    }));

    it('should not set selected on change detection cycle when already selected', fakeAsync(() => {
      component.row = component.dataSource.data[0]; // Should be checked 'a'.
      component.column.selectionModel.select(component.row);
      spyOn(component.column.selectionModel, 'select');
      component.ngDoCheck();
      flush();
      expect(component.column.selectionModel.select).not.toHaveBeenCalled();
    }));

    it('should not set unselected on change detection cycle when already unselected', fakeAsync(() => {
      spyOn(component.column.selectionModel, 'deselect');
      component.row = component.dataSource.data[1]; // Should be unchecked 'd'.
      component.ngDoCheck();
      flush();
      expect(component.column.selectionModel.deselect).not.toHaveBeenCalled();
    }));

    it('should correctly toggle all checkboxes to selected', () => {
      component.toggleSelectAll();
      expect(component.isAllSelected()).toEqual(true);
      component.dataSource.data.forEach((row: any) => {
        expect(row.prop1).toEqual(component.column.cellCheckboxValueMap.checked);
      });
      expect(component.column.cellCheckboxCb).toHaveBeenCalledWith(jasmine.any(Object), component.column.name, component.column.cellCheckboxValueMap.checked);
    });

    it('should correctly toggle all checkboxes to unselected', () => {
      component.column.selectionModel.select(...component.dataSource.data);
      component.toggleSelectAll();
      expect(component.isAllSelected()).toEqual(false);
      component.dataSource.data.forEach((row: any) => {
        expect(row.prop1).toEqual(component.column.cellCheckboxValueMap.unchecked);
      });
      expect(component.column.cellCheckboxCb).toHaveBeenCalledWith(jasmine.any(Object), component.column.name, component.column.cellCheckboxValueMap.unchecked);
    });

    it('should correctly handle cell checkbox change', () => {
      component.row = component.dataSource.data[0];
      spyOn(component.selectionModel, 'toggle').and.callThrough();
      spyOn(component.change, 'emit');
      component._onChanged();
      expect(component.selectionModel.toggle).toHaveBeenCalledWith(component.row);
      expect(component.change.emit).toHaveBeenCalledWith(component.selectionModel.isSelected(component.row));
    });
  });
});
