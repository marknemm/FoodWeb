import { TestBed } from '@angular/core/testing';
import { ReadFeaturedEventService } from './read-featured-event.service';

describe('ReadFeaturedEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReadFeaturedEventService = TestBed.inject(ReadFeaturedEventService);
    expect(service).toBeTruthy();
  });
});
