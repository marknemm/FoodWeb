import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppPasswordComponent } from './app-password.component';

describe('AppPasswordComponent', () => {
  let component: AppPasswordComponent;
  let fixture: ComponentFixture<AppPasswordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
