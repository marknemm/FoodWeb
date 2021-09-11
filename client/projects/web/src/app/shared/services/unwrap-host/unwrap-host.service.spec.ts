import { TestBed } from '@angular/core/testing';

import { UnwrapHostService } from './unwrap-host.service';

describe('UnwrapHostService', () => {
  let service: UnwrapHostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnwrapHostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
