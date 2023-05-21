import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { AccountFormAdapter } from './account-form-adapter.service';

describe('AccountFormAdapter', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountFormAdapter = TestBed.inject(AccountFormAdapter);
    expect(service).toBeTruthy();
  });
});
