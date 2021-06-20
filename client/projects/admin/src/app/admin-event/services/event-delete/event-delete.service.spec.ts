import { TestBed } from '@angular/core/testing';
import { EventDeleteService } from './event-delete.service';

describe('EventDeleteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventDeleteService = TestBed.inject(EventDeleteService);
    expect(service).toBeTruthy();
  });
});
