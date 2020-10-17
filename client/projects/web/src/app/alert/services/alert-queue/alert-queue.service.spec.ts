import { TestBed } from '@angular/core/testing';
import { AlertQueueService } from './alert-queue.service';

describe('AlertQueueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlertQueueService = TestBed.get(AlertQueueService);
    expect(service).toBeTruthy();
  });
});
