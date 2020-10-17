import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountTypeComponent } from './account-type.component';

describe('AccountTypeComponent', () => {
  let component: AccountTypeComponent;
  let fixture: ComponentFixture<AccountTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
