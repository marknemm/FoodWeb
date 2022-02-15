import { TestBed } from '@angular/core/testing';

import { AccountSortOptionsService } from './account-sort-options.service';

describe('AccountSortOptionsService', () => {
  let service: AccountSortOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountSortOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
