import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { AccountReadService } from './account-read.service';

describe('AccountReadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountReadService = TestBed.get(AccountReadService);
    expect(service).toBeTruthy();
  });
});
