import { TestBed } from '@angular/core/testing';
import { AppDataService } from './app-data.service';

describe('AppDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppDataService = TestBed.get(AppDataService);
    expect(service).toBeTruthy();
  });
});
