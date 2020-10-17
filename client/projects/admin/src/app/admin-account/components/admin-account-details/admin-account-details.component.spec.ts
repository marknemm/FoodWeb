import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AdminAccountDetailsComponent } from './admin-account-details.component';

describe('AdminAccountDetailsComponent', () => {
  let component: AdminAccountDetailsComponent;
  let fixture: ComponentFixture<AdminAccountDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAccountDetailsComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
