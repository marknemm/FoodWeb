import { TestBed } from '@angular/core/testing';

import { FragmentScrollService } from './fragment-scroll.service';

describe('FragmentScrollService', () => {
  let service: FragmentScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FragmentScrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
