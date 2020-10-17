import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppTimeComponent } from './app-time.component';

describe('AppTimeComponent', () => {
  let component: AppTimeComponent;
  let fixture: ComponentFixture<AppTimeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
