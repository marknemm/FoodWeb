import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppTextFieldComponent } from './app-text-field.component';

describe('AppTextFieldComponent', () => {
  let component: AppTextFieldComponent;
  let fixture: ComponentFixture<AppTextFieldComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppTextFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTextFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
