import { TestBed } from '@angular/core/testing';
import { UpdateFeaturedEventService } from './update-featured-event.service';

describe('UpdateFeaturedEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UpdateFeaturedEventService = TestBed.get(UpdateFeaturedEventService);
    expect(service).toBeTruthy();
  });
});
