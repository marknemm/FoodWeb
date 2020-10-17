import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SignupVerificationComponent } from './signup-verification.component';

describe('SignupVerificationComponent', () => {
  let component: SignupVerificationComponent;
  let fixture: ComponentFixture<SignupVerificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
