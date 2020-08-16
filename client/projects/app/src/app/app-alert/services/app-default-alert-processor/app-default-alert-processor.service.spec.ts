import { TestBed } from '@angular/core/testing';
import { AppDefaultAlertProcessorService } from './app-default-alert-processor.service';

describe('AppDefaultAlertProcessorService', () => {
  let service: AppDefaultAlertProcessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppDefaultAlertProcessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
