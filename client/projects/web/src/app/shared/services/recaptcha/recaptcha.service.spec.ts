import { TestBed } from '@angular/core/testing';

import { RecaptchaService } from './recaptcha.service';

describe('RecaptchaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecaptchaService = TestBed.inject(RecaptchaService);
    expect(service).toBeTruthy();
  });
});
