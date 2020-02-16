import { TestBed } from '@angular/core/testing';
import { RegisterEventService } from './register-event.service';

describe('RegisterEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegisterEventService = TestBed.get(RegisterEventService);
    expect(service).toBeTruthy();
  });
});
