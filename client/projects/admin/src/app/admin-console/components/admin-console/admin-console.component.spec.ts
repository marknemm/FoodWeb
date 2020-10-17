import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AdminConsoleComponent } from './admin-console.component';

describe('AdminConsoleComponent', () => {
  let component: AdminConsoleComponent;
  let fixture: ComponentFixture<AdminConsoleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminConsoleComponent ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
