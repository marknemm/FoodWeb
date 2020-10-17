import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';


import { AccountSelectDialogComponent } from './account-select-dialog.component';

describe('AccountSelectDialogComponent', () => {
  let component: AccountSelectDialogComponent;
  let fixture: ComponentFixture<AccountSelectDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountSelectDialogComponent ],

    }).compileComponents();

    fixture = TestBed.createComponent(AccountSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
