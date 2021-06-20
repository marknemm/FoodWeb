import { TestBed } from '@angular/core/testing';
import { EventUpdateService } from './event-update.service';

describe('EventUpdateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventUpdateService = TestBed.inject(EventUpdateService);
    expect(service).toBeTruthy();
  });
});
