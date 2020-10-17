import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTextViewComponent } from './app-text-view.component';

describe('AppTextViewComponent', () => {
  let component: AppTextViewComponent;
  let fixture: ComponentFixture<AppTextViewComponent>;

  beforeEach(async(() => {
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
