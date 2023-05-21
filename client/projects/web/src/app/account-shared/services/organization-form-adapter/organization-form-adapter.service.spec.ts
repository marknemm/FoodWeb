import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { OrganizationFormAdapter } from './organization-form-adapter.service';

describe('OrganizationFormAdapter', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrganizationFormAdapter = TestBed.inject(OrganizationFormAdapter);
    expect(service).toBeTruthy();
  });
});
