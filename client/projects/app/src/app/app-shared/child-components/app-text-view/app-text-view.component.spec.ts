import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppTextViewComponent } from './app-text-view.component';

describe('AppTextViewComponent', () => {
  let component: AppTextViewComponent;
  let fixture: ComponentFixture<AppTextViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppTextViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTextViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
