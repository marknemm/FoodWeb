import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { BootstrapService } from './bootstrap.service';

describe('BootstrapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BootstrapService = TestBed.get(BootstrapService);
    expect(service).toBeTruthy();
  });
});
