import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AdminAccountsComponent } from './admin-accounts.component';

describe('AdminAccountsComponent', () => {
  let component: AdminAccountsComponent;
  let fixture: ComponentFixture<AdminAccountsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAccountsComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
