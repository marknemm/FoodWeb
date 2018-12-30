import { TestBed } from '@angular/core/testing';
import { OperationHoursValidationService } from './operation-hours-validation.service';

describe('OperationHoursValidationService', () => {
  let service: OperationHoursValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OperationHoursValidationService]
    });
    service = TestBed.get(OperationHoursValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
