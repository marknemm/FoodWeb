import { TestBed } from '@angular/core/testing';
import { AppSessionService } from './app-session.service';

describe('AppSessionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppSessionService = TestBed.inject(AppSessionService);
    expect(service).toBeTruthy();
  });
});
