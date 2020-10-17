import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AccountCreationFormComponent } from './account-creation-form.component';

describe('AccountCreationFormComponent', () => {
  let component: AccountCreationFormComponent;
  let fixture: ComponentFixture<AccountCreationFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountCreationFormComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountCreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
