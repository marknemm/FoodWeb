import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { HybridBootstrapService } from './hybrid-bootstrap.service';

describe('HybridBootstrapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HybridBootstrapService = TestBed.get(HybridBootstrapService);
    expect(service).toBeTruthy();
  });
});
