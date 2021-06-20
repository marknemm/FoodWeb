import { TestBed } from '@angular/core/testing';
import { EventReadService } from './event-read.service';

describe('EventReadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventReadService = TestBed.inject(EventReadService);
    expect(service).toBeTruthy();
  });
});
