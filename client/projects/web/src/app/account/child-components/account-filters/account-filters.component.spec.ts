import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';


import { AccountFiltersComponent } from './account-filters.component';

describe('AccountFiltersComponent', () => {
  let component: AccountFiltersComponent;
  let fixture: ComponentFixture<AccountFiltersComponent>;

  beforeEach(waitForAsync(() => {
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
