import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MockComponent, MockDirective } from 'ng-mocks';
import { TableAddComponent, TableDataSource } from './table-add.component';

describe('TableAddComponent', () => {
  let component: TableAddComponent;
  let fixture: ComponentFixture<TableAddComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TableAddComponent,
        MockComponent(MatButton),
        MockComponent(MatIcon),
        MockDirective(MatTooltip)
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('On init', () => {

    it('should set undefined tooltip to defined buttonText', () => {
      component.buttonText = 'Add Row Button Text';
      component.tooltip = undefined;
      component.ngOnInit();
      expect(component.tooltip).toEqual(component.buttonText);
    });

    it('should set undefined ariaLabel to defined tooltip', () => {
      component.tooltip = 'Add Row Tooltip';
      component.ariaLabel = undefined;
      component.ngOnInit();
      expect(component.ariaLabel).toEqual(component.tooltip);
    });

    it('should set undefined tooltip to default text when buttonText is undefined', () => {
      component.buttonText = undefined;
      component.tooltip = undefined;
      component.ngOnInit();
      expect(component.tooltip).toEqual('Add Row');
    });
  });

  it('should correctly handle add button click', () => {
    component.dataSource = new TableDataSource([]);
    spyOn(component.dataSource.add$, 'next');
    spyOn(component.add, 'emit');
    component._onClick();
    expect(component.dataSource.add$.next).toHaveBeenCalled();
    expect(component.add.emit).toHaveBeenCalled();
  });
});
