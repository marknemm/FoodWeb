import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { ReceiverFormAdapter } from './receiver-form-adapter.service';

describe('ReceiverFormAdapter', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReceiverFormAdapter = TestBed.inject(ReceiverFormAdapter);
    expect(service).toBeTruthy();
  });
});
