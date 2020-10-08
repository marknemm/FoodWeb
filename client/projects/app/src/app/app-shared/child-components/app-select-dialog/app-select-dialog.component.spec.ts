import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSelectDialogComponent } from './app-select-dialog.component';

describe('AppSelectDialogComponent', () => {
  let component: AppSelectDialogComponent;
  let fixture: ComponentFixture<AppSelectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppSelectDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
