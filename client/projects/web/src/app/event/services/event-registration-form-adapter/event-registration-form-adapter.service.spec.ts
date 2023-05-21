import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { EventRegistrationFormAdapter } from './event-registration-form-adapter.service';

describe('EventRegistrationFormAdapter', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventRegistrationFormAdapter = TestBed.inject(EventRegistrationFormAdapter);
    expect(service).toBeTruthy();
  });
});
