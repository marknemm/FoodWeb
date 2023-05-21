import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { VolunteerFormAdapter } from './volunteer-form-adapter.service';

describe('VolunteerFormAdapter', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VolunteerFormAdapter = TestBed.inject(VolunteerFormAdapter);
    expect(service).toBeTruthy();
  });
});
