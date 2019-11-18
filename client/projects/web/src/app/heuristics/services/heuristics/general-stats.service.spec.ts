import { TestBed } from '@angular/core/testing';
import { GeneralStatsService } from './general-stats.service';

describe('GeneralStatsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeneralStatsService = TestBed.get(GeneralStatsService);
    expect(service).toBeTruthy();
  });
});
