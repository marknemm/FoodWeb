import { TestBed } from '@angular/core/testing';

import { DeleteFeaturedEventService } from './delete-featured-event.service';

describe('DeleteFeaturedEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeleteFeaturedEventService = TestBed.get(DeleteFeaturedEventService);
    expect(service).toBeTruthy();
  });
});
