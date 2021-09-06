import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AdminAccountComponent } from './admin-account.component';

describe('AdminAccountComponent', () => {
  let component: AdminAccountComponent;
  let fixture: ComponentFixture<AdminAccountComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAccountComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
