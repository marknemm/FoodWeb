import { TestBed } from '@angular/core/testing';
import { ServerSentEventSourceService } from './server-sent-event-source.service';

describe('ServerSentEventSourceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServerSentEventSourceService = TestBed.inject(ServerSentEventSourceService);
    expect(service).toBeTruthy();
  });
});
