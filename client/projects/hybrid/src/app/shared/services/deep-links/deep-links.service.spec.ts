import { TestBed } from '@angular/core/testing';
import { DeepLinksService } from './deep-links.service';

describe('DeepLinksService', () => {
  let service: DeepLinksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeepLinksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
