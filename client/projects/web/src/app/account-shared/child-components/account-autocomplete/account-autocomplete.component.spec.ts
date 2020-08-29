import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountAutocompleteComponent } from './account-autocomplete.component';

describe('AccountAutocompleteComponent', () => {
  let component: AccountAutocompleteComponent;
  let fixture: ComponentFixture<AccountAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountAutocompleteComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
