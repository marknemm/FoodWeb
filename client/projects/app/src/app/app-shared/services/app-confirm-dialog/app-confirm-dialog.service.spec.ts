import { TestBed } from '@angular/core/testing';
import { AppConfirmDialogService } from './app-confirm-dialog.service';

describe('AppConfirmDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppConfirmDialogService = TestBed.inject(AppConfirmDialogService);
    expect(service).toBeTruthy();
  });
});
