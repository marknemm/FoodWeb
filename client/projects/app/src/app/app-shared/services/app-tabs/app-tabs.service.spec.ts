import { TestBed } from '@angular/core/testing';
import { AppTabsService } from './app-tabs.service';

describe('AppTabsService', () => {
  let service: AppTabsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppTabsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
