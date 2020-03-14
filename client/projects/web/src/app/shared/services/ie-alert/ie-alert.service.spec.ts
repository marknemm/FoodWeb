import { TestBed } from '@angular/core/testing';

import { IeAlertService } from './ie-alert.service';

describe('IeAlertService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IeAlertService = TestBed.get(IeAlertService);
    expect(service).toBeTruthy();
  });
});
