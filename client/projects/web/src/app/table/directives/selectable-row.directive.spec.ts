import { SelectableRowDirective, TableSelectionType } from './selectable-row.directive';

describe('SelectableRowDirective', () => {
  let directive: SelectableRowDirective;

  beforeEach(() => {
    directive = new SelectableRowDirective();
    directive.row = {};
    directive.dataSource = <any>{ selectionModel: jasmine.createSpyObj('SelectionModel', ['deselect', 'select', 'clear']) };
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should deselect row on disabled select', () => {
    directive.disableSelect = true;
    directive.ngOnChanges({ disableSelect: <any>{ previousValue: false } });
    expect(directive.dataSource.selectionModel.deselect).toHaveBeenCalledWith(directive.row);
  });

  it('should not deselect row on enabled select', () => {
    directive.disableSelect = false;
    directive.ngOnChanges({ disableSelect: <any>{ previousValue: true } });
    expect(directive.dataSource.selectionModel.deselect).not.toHaveBeenCalled();
  });

  it('should not handle click when selection type is checkbox', () => {
    directive.dataSource.selectionType = TableSelectionType.checkbox;
    directive._onClick(<any>{});
    expect(directive.dataSource.selectionModel.clear).not.toHaveBeenCalled();
    expect(directive.dataSource.selectionModel.select).not.toHaveBeenCalled();
  });

  it('should handle single selection click correctly', () => {
    directive.dataSource.selectionType = TableSelectionType.single;
    directive._onClick(<any>{});
    expect(directive.dataSource.selectionModel.clear).toHaveBeenCalled();
    expect(directive.dataSource.selectionModel.select).toHaveBeenCalledWith(directive.row);
  });

  it('should handle multi selection click correctly with ctrlKey modifier pressed down', () => {
    directive.dataSource.selectionType = TableSelectionType.multi;
    directive._onClick(<any>{ ctrlKey: true });
    expect(directive.dataSource.selectionModel.clear).not.toHaveBeenCalled();
    expect(directive.dataSource.selectionModel.select).toHaveBeenCalledWith(directive.row);
  });

  it('should handle multi selection click correctly with metaKey modifier pressed down', () => {
    directive.dataSource.selectionType = TableSelectionType.multi;
    directive._onClick(<any>{ metaKey: true });
    expect(directive.dataSource.selectionModel.clear).not.toHaveBeenCalled();
    expect(directive.dataSource.selectionModel.select).toHaveBeenCalledWith(directive.row);
  });

  it('should handle multi selection click correctly with no key modifier pressed down', () => {
    directive.dataSource.selectionType = TableSelectionType.multi;
    directive._onClick(<any>{});
    expect(directive.dataSource.selectionModel.clear).toHaveBeenCalled();
    expect(directive.dataSource.selectionModel.select).toHaveBeenCalledWith(directive.row);
  });
});