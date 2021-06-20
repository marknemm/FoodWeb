import { TestBed } from '@angular/core/testing';
import { EventCreateService } from './event-create.service';

describe('EventCreateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventCreateService = TestBed.inject(EventCreateService);
    expect(service).toBeTruthy();
  });
});
