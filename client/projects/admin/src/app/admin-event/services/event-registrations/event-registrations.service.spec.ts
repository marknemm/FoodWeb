import { TestBed } from '@angular/core/testing';

import { EventRegistrationsService } from './event-registrations.service';

describe('EventRegistrationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventRegistrationsService = TestBed.get(EventRegistrationsService);
    expect(service).toBeTruthy();
  });
});
