import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminLeftNavItemsComponent } from './admin-left-nav-items.component';

describe('AdminLeftNavItemsComponent', () => {
  let component: AdminLeftNavItemsComponent;
  let fixture: ComponentFixture<AdminLeftNavItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLeftNavItemsComponent ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLeftNavItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
