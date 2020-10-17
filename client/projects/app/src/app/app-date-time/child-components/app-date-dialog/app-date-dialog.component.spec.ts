import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppDateDialogComponent } from './app-date-dialog.component';

describe('AppDateDialogComponent', () => {
  let component: AppDateDialogComponent;
  let fixture: ComponentFixture<AppDateDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppDateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppDateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
