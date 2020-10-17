import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTimeDialogComponent } from './app-time-dialog.component';

describe('AppTimeDialogComponent', () => {
  let component: AppTimeDialogComponent;
  let fixture: ComponentFixture<AppTimeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppTimeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTimeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
