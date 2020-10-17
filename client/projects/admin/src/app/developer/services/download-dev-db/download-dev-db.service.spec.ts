import { TestBed } from '@angular/core/testing';

import { DownloadDevDbService } from './download-dev-db.service';

describe('DownloadDevDbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DownloadDevDbService = TestBed.inject(DownloadDevDbService);
    expect(service).toBeTruthy();
  });
});
