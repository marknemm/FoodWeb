import { TestBed } from '@angular/core/testing';
import { AppAuthGaurdService } from './app-auth-gaurd.service';

describe('AppAuthGaurdService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppAuthGaurdService = TestBed.get(AppAuthGaurdService);
    expect(service).toBeTruthy();
  });
});
