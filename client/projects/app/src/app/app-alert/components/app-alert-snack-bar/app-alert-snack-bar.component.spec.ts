import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppAlertSnackBarComponent } from './app-alert-snack-bar.component';

describe('AppAlertSnackBarComponent', () => {
  let component: AppAlertSnackBarComponent;
  let fixture: ComponentFixture<AppAlertSnackBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppAlertSnackBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppAlertSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
