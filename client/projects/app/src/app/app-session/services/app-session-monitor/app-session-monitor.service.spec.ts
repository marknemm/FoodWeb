import { TestBed } from '@angular/core/testing';
import { AppSessionMonitorService } from './app-session-monitor.service';

describe('AppSessionMonitorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppSessionMonitorService = TestBed.inject(AppSessionMonitorService);
    expect(service).toBeTruthy();
  });
});
