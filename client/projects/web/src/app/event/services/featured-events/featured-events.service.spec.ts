import { TestBed } from '@angular/core/testing';

import { FeaturedEventsService } from './featured-events.service';

describe('FeaturedEventsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FeaturedEventsService = TestBed.inject(FeaturedEventsService);
    expect(service).toBeTruthy();
  });
});
