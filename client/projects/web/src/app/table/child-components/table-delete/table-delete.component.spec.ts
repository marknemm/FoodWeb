import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButton, MatIcon, MatTooltip } from '@angular/material';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { ConfirmDialogService } from '~web/shared/confirm-dialog/confirm-dialog.service';
import { TableDataSource, TableDeleteComponent } from './table-delete.component';

describe('TableDeleteComponent', () => {
  let component: TableDeleteComponent;
  let fixture: ComponentFixture<TableDeleteComponent>;
  let mockConfirmDialogService: jasmine.SpyObj<ConfirmDialogService>;

  beforeEach(waitForAsync(() => {
    mockConfirmDialogService = jasmine.createSpyObj<ConfirmDialogService>(['open']);
    mockConfirmDialogService.open.and.returnValue(of(true));
    TestBed.configureTestingModule({
      declarations: [
        TableDeleteComponent,
        MockComponent(MatButton),
        MockComponent(MatIcon),
        MockDirective(MatTooltip)
      ],
      providers: [
        { provide: ConfirmDialogService, useValue: mockConfirmDialogService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('On init', () => {

    it('should set undefined tooltip to defined buttonText', () => {
      component.buttonText = 'Delete Row Button Text';
      component.tooltip = undefined;
      component.ngOnInit();
      expect(component.tooltip).toEqual(component.buttonText);
    });

    it('should set undefined ariaLabel to defined tooltip', () => {
      component.tooltip = 'Delete Row Tooltip';
      component.ariaLabel = undefined;
      component.ngOnInit();
      expect(component.ariaLabel).toEqual(component.tooltip);
    });

    it('should set undefined tooltip to default text when buttonText is undefined', () => {
      component.buttonText = undefined;
      component.tooltip = undefined;
      component.ngOnInit();
      expect(component.tooltip).toEqual('Delete Row');
    });
  });

  describe('On delete button click', () => {

    it('should display confirm dialog when confirmMessage is set', () => {
      component.confirmMessage = 'Confirm Message';
      component._onClick();
      expect(mockConfirmDialogService.open).toHaveBeenCalledWith(component.confirmTitle, component.confirmMessage);
    });

    it('should not emit delete event(s) when cancel delete selected in confirm dialog', () => {
      component.confirmMessage = 'Confirm Message';
      mockConfirmDialogService.open.and.returnValue(of(false));
      component._onClick();
      expect(mockConfirmDialogService.open).toHaveBeenCalledWith(component.confirmTitle, component.confirmMessage);
    });

    it('should emit delete event(s) automatically when confirmMessage not specified (not use confirm dialog)', () => {
      component.dataSource = new TableDataSource([]);
      spyOn(component.dataSource.delete$, 'next');
      spyOn(component.delete, 'emit');
      component.confirmMessage = null;
      component._onClick();
      expect(mockConfirmDialogService.open).not.toHaveBeenCalled();
      expect(component.dataSource.delete$.next).toHaveBeenCalledWith(component.row);
      expect(component.delete.emit).toHaveBeenCalledWith(component.row);
    });
  });
});
