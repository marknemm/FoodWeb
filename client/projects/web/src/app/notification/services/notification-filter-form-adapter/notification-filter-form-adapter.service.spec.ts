import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { DonorFormAdapter } from './donor-form-adapter.service';

describe('DonorFormAdapter', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DonorFormAdapter = TestBed.inject(DonorFormAdapter);
    expect(service).toBeTruthy();
  });
});
