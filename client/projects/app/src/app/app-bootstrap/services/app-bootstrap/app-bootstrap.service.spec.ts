import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { AppBootstrapService } from './app-bootstrap.service';

describe('AppBootstrapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppBootstrapService = TestBed.get(AppBootstrapService);
    expect(service).toBeTruthy();
  });
});
