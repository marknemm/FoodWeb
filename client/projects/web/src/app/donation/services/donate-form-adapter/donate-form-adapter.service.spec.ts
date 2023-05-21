import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { DonateFormAdapter } from './donate-form-adapter.service';

describe('DonateFormAdapter', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DonateFormAdapter = TestBed.inject(DonateFormAdapter);
    expect(service).toBeTruthy();
  });
});
