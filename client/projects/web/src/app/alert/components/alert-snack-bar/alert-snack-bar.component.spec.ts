import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertSnackBarComponent } from './alert-snack-bar.component';

describe('AlertSnackBarComponent', () => {
  let component: AlertSnackBarComponent;
  let fixture: ComponentFixture<AlertSnackBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertSnackBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
