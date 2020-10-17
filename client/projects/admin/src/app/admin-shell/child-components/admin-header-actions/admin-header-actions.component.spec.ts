import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AdminHeaderActionsComponent } from './admin-header-actions.component';

describe('AdminHeaderActionsComponent', () => {
  let component: AdminHeaderActionsComponent;
  let fixture: ComponentFixture<AdminHeaderActionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminHeaderActionsComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminHeaderActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
