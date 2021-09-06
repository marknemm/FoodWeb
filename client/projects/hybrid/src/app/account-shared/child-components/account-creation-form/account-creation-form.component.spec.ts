import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCreationFormComponent } from './account-creation-form.component';

describe('AccountCreationFormComponent', () => {
  let component: AccountCreationFormComponent;
  let fixture: ComponentFixture<AccountCreationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountCreationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
