import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { ContactInfoFormAdapter } from './contact-info-form-adapter.service';

describe('ContactInfoFormAdapter', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContactInfoFormAdapter = TestBed.inject(ContactInfoFormAdapter);
    expect(service).toBeTruthy();
  });
});
