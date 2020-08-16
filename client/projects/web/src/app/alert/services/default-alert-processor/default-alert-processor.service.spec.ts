import { TestBed } from '@angular/core/testing';
import { DefaultAlertProcessorService } from './default-alert-processor.service';

describe('DefaultAlertProcessorService', () => {
  let service: DefaultAlertProcessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DefaultAlertProcessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
