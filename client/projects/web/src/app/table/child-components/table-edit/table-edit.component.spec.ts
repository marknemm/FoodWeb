import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MockComponent, MockDirective } from 'ng-mocks';
import { TableDataSource, TableEditComponent } from './table-edit.component';

describe('TableEditComponent', () => {
  let component: TableEditComponent;
  let fixture: ComponentFixture<TableEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TableEditComponent,
        MockComponent(MatButton),
        MockComponent(MatIcon),
        MockDirective(MatTooltip)
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableEditComponent);
    component = fixture.componentInstance;
    component.dataSource = <any> {
      editConfig: {}
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('On init', () => {

    it('should set undefined tooltip to defined buttonText', () => {
      component.buttonText = 'Edit Row Button Text';
      component.tooltip = undefined;
      component.ngOnInit();
      expect(component.tooltip).toEqual(component.buttonText);
    });

    it('should set undefined ariaLabel to defined tooltip', () => {
      component.tooltip = 'Edit Row Tooltip';
      component.ariaLabel = undefined;
      component.ngOnInit();
      expect(component.ariaLabel).toEqual(component.tooltip);
    });

    it('should set undefined tooltip to default text when buttonText is undefined', () => {
      component.buttonText = undefined;
      component.tooltip = undefined;
      component.ngOnInit();
      expect(component.tooltip).toEqual('Edit Row');
    });
  });

  it('should correctly handle edit button click', () => {
    component.dataSource = new TableDataSource([]);
    spyOn(component.dataSource.edit$, 'next');
    spyOn(component.edit, 'emit');
    component._onClick();
    expect(component.dataSource.edit$.next).toHaveBeenCalledWith(component.row);
    expect(component.edit.emit).toHaveBeenCalledWith(component.row);
  });
});