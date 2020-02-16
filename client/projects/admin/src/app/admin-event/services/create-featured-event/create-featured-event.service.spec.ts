import { TestBed } from '@angular/core/testing';
import { CreateFeaturedEventService } from './create-featured-event.service';

describe('CreateFeaturedEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreateFeaturedEventService = TestBed.get(CreateFeaturedEventService);
    expect(service).toBeTruthy();
  });
});
