import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { AdminAccountCreateService } from './admin-account-create';

describe('AdminAccountCreateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminAccountCreateService = TestBed.get(AdminAccountCreateService);
    expect(service).toBeTruthy();
  });
});