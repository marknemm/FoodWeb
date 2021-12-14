import { TestBed } from '@angular/core/testing';
import { FormValuePreprocessorService } from './form-value-preprocessor.service';

describe('FormValuePreprocessorService', () => {
  let service: FormValuePreprocessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormValuePreprocessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
