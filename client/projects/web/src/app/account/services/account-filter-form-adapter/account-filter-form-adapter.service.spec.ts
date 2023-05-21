import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { AccountFilterFormAdapter } from './account-filter-form-adapter.service';

describe('AccountFilterFormAdapter', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountFilterFormAdapter = TestBed.inject(AccountFilterFormAdapter);
    expect(service).toBeTruthy();
  });
});
