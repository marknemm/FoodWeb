import { TestBed } from '@angular/core/testing';

import { SectionEditService } from './section-edit.service';

describe('SectionEditService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SectionEditService = TestBed.get(SectionEditService);
    expect(service).toBeTruthy();
  });
});
