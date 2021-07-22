import { TestBed } from '@angular/core/testing';
import { ShellService } from './shell.service';

describe('ShellService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShellService = TestBed.inject(ShellService);
    expect(service).toBeTruthy();
  });
});
