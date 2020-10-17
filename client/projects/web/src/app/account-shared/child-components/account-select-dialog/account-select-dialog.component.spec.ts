import { async, ComponentFixture, TestBed } from '@angular/core/testing';


import { AccountSelectDialogComponent } from './account-select-dialog.component';

describe('AccountSelectDialogComponent', () => {
  let component: AccountSelectDialogComponent;
  let fixture: ComponentFixture<AccountSelectDialogComponent>;

  beforeEach(async(() => {
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
