import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { OperationHoursFormAdapter } from './operation-hours-form-adapter.service';

describe('OperationHoursFormAdapter', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OperationHoursFormAdapter = TestBed.inject(OperationHoursFormAdapter);
    expect(service).toBeTruthy();
  });
});
