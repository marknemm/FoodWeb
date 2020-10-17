import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { AdminAccountMessageService } from './admin-account-message.service';

describe('AdminAccountMessageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminAccountMessageService = TestBed.inject(AdminAccountMessageService);
    expect(service).toBeTruthy();
  });
});
