import { TestBed } from '@angular/core/testing';

import { AccountListLabelService } from './account-list-label.service';

describe('AccountListLabelService', () => {
  let service: AccountListLabelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountListLabelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
