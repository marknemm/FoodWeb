import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTeaserComponent } from './account-teaser.component';

describe('AccountTeaserComponent', () => {
  let component: AccountTeaserComponent;
  let fixture: ComponentFixture<AccountTeaserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountTeaserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountTeaserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
