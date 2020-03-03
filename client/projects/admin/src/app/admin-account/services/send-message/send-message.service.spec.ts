import { TestBed } from '@angular/core/testing';

import { SendMessageService } from './send-message.service';

describe('SendMessageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SendMessageService = TestBed.get(SendMessageService);
    expect(service).toBeTruthy();
  });
});
