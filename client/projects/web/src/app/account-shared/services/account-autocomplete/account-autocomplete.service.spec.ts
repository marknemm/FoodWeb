import { TestBed } from '@angular/core/testing';

import { AccountAutocompleteService } from './account-autocomplete.service';

describe('AccountAutocompleteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountAutocompleteService = TestBed.get(AccountAutocompleteService);
    expect(service).toBeTruthy();
  });
});