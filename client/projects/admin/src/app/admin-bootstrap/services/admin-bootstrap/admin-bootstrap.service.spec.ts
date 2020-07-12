import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { AdminBootstrapService } from './admin-bootstrap.service';

describe('AdminBootstrapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminBootstrapService = TestBed.get(AdminBootstrapService);
    expect(service).toBeTruthy();
  });
});
