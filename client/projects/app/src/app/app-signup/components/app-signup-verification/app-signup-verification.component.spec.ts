import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSignupVerificationComponent } from './app-signup-verification.component';

describe('AppSignupVerificationComponent', () => {
  let component: AppSignupVerificationComponent;
  let fixture: ComponentFixture<AppSignupVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppSignupVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSignupVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});