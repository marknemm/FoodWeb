import { TestBed } from '@angular/core/testing';
import { HttpResponseService } './http-response.service';

describe('HttpResponseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpResponseService = TestBed.get(HttpResponseService);
    expect(service).toBeTruthy();
  });
});
