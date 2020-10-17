import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminHeaderActionsComponent } from './admin-header-actions.component';

describe('AdminHeaderActionsComponent', () => {
  let component: AdminHeaderActionsComponent;
  let fixture: ComponentFixture<AdminHeaderActionsComponent>;

  beforeEach(async(() => {
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
