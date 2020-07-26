import { async, ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MockComponent } from 'ng-mocks';
import { TableAddComponent } from '~web/table/table-add/table-add.component';
import { TableDataSource } from '~web/table/interfaces/table-data-source';
import { TableTitleComponent } from './table-title.component';

describe('TableTitleComponent', () => {
  let component: TableTitleComponent;
  let fixture: ComponentFixture<TableTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TableTitleComponent,
        MockComponent(MatIcon),
        MockComponent(MatInput),
        MockComponent(MatFormField),
        MockComponent(TableAddComponent)
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableTitleComponent);
    component = fixture.componentInstance;
    component.dataSource = new TableDataSource<any>([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update table filter', fakeAsync(() => {
    component.updateFilter({ target: { value: 'abc' } });
    flush();
    expect(component.dataSource.filter).toEqual('abc');
  }));

  it('should correctly handle search form field focus', () => {
    const mockInputElement: jasmine.SpyObj<HTMLInputElement> = jasmine.createSpyObj<HTMLInputElement>(['click']);
    component['_showDatatableFilter'] = false;
    component._onSearchFormFieldFocus(mockInputElement);
    expect(component.searchFilterVisible).toEqual(true);
    expect(mockInputElement.disabled).toEqual(false);
    expect(mockInputElement.click).toHaveBeenCalled();
  });

  it('should correctly handle search form field hover', () => {
    component['_showDatatableFilter'] = false;
    component._onSearchFormFieldHover();
    expect(component.searchFilterVisible).toEqual(true);
  });

  it('should correctly handle table title content mouse leave', () => {
    component['_showDatatableFilter'] = true;
    const mockInputElement: jasmine.SpyObj<HTMLInputElement> = jasmine.createSpyObj<HTMLInputElement>(['']);
    component._recalcShowDatatableFilter(mockInputElement);
    expect(component.searchFilterVisible).toEqual(false);
  });
});
