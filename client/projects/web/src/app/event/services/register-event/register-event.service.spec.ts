import { TestBed } from '@angular/core/testing';
import { RegisterEventService } from './register-event.service';

describe('RegisterEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegisterEventService = TestBed.inject(RegisterEventService);
    expect(service).toBeTruthy();
  });
});
