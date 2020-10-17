import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AdminAccountFiltersComponent } from './admin-account-filters.component';

describe('AdminAccountFiltersComponent', () => {
  let component: AdminAccountFiltersComponent;
  let fixture: ComponentFixture<AdminAccountFiltersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAccountFiltersComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAccountFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
