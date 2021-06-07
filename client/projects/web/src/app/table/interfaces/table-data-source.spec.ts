import { TableDataSource, TableSelectionType } from './table-data-source';

describe('TableDataSource', () => {
  let webuiDataSource: TableDataSource<any>;

  beforeEach(() => {
    webuiDataSource = new TableDataSource();
  });

  it('should be created', () => {
    expect(webuiDataSource).toBeTruthy();
  });

  describe('Init with column object array', () => {

    beforeEach(() => {
      webuiDataSource = new TableDataSource([], [
        { name: 'firstName' },
        { name: 'last_name' },
        { name: 'USAAlpha123', dataTransform: (row: any) => (row['USAAlpha123'] === 'abc' ? '******' : 'xxxxxx') },
        { name: 'personNumber', visibleName: 'Person #' }
      ]);
    });

    it('should have correctly generated visible column names', () => {
      expect(webuiDataSource.columns[0].visibleName).toEqual('First Name');
      expect(webuiDataSource.columns[1].visibleName).toEqual('Last Name');
      expect(webuiDataSource.columns[2].visibleName).toEqual('USA Alpha 123');
      expect(webuiDataSource.columns[3].visibleName).toEqual('Person #');
    });

    it('should get correct column names', () => {
      expect(webuiDataSource.columnNames).toEqual(['firstName', 'last_name', 'USAAlpha123', 'personNumber']);
    });

    it('should correctly filter rows with custom filter predicate', () => {
      webuiDataSource.data = [
        { firstName: 'Joe', last_name: 'Smoe', USAAlpha123: 'abc', personNumber: '00000000' },
        { firstName: 'John', last_name: 'Doe', USAAlpha123: 'abcd', personNumber: '00000001' }
      ];
      webuiDataSource.filter = '******';
      expect(webuiDataSource.filterPredicate(webuiDataSource.data[0], webuiDataSource.filter)).toEqual(true);
      expect(webuiDataSource.filterPredicate(webuiDataSource.data[1], webuiDataSource.filter)).toEqual(false);
    });
  });

  describe('Init with column name string array', () => {

    beforeEach(() => {
      webuiDataSource = new TableDataSource([], [ 'firstName', 'lastName' ]);
    });

    it('should have correctly converted column string names to column objects', () => {
      expect(webuiDataSource.columns.length).toEqual(2);
      expect(webuiDataSource.columns[0].name).toEqual('firstName');
      expect(webuiDataSource.columns[0].visibleName).toEqual('First Name');
      expect(webuiDataSource.columns[1].name).toEqual('lastName');
      expect(webuiDataSource.columns[1].visibleName).toEqual('Last Name');
    });
  });

  describe('Init with selection type', () => {

    beforeEach(() => {
      webuiDataSource = new TableDataSource([], [], TableSelectionType.single);
    });

    it('should have correctly generated a selection model', () => {
      expect(webuiDataSource.selectionModel.isMultipleSelection()).toEqual(false);
    });

    it('should have correct selection type', () => {
      expect(webuiDataSource.selectionType).toEqual(TableSelectionType.single);
    });
  });

});
