import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminAccountFiltersComponent } from './admin-account-filters.component';

describe('AdminAccountFiltersComponent', () => {
  let component: AdminAccountFiltersComponent;
  let fixture: ComponentFixture<AdminAccountFiltersComponent>;

  beforeEach(async(() => {
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
