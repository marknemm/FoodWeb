import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppAlertDialogComponent } from './app-alert-dialog.component';

describe('AppAlertDialogComponent', () => {
  let component: AppAlertDialogComponent;
  let fixture: ComponentFixture<AppAlertDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppAlertDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppAlertDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
