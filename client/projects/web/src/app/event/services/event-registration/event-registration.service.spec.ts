import { TestBed } from '@angular/core/testing';
import { EventRegistrationService } from './event-registration.service';

describe('EventRegistrationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventRegistrationService = TestBed.inject(EventRegistrationService);
    expect(service).toBeTruthy();
  });
});
