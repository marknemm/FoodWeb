import { TestBed } from '@angular/core/testing';

import { ServerSideEventSourceService } from './server-side-event-source.service';

describe('ServerSideEventSourceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServerSideEventSourceService = TestBed.get(ServerSideEventSourceService);
    expect(service).toBeTruthy();
  });
});
