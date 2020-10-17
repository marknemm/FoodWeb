import { async, ComponentFixture, TestBed } from '@angular/core/testing';


import { AccountFiltersComponent } from './account-filters.component';

describe('AccountFiltersComponent', () => {
  let component: AccountFiltersComponent;
  let fixture: ComponentFixture<AccountFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountFiltersComponent ],

    }).compileComponents();

    fixture = TestBed.createComponent(AccountFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
