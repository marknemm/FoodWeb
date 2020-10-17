import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import 'jasmine';
import { AdminAccountMessageComponent } from './admin-account-message.component';

describe('AdminAccountMessageComponent', () => {
  let component: AdminAccountMessageComponent;
  let fixture: ComponentFixture<AdminAccountMessageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAccountMessageComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAccountMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
