import { TestBed } from '@angular/core/testing';

import { AdminSessionService } from './admin-session.service';

describe('AdminSessionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminSessionService = TestBed.get(AdminSessionService);
    expect(service).toBeTruthy();
  });
});
