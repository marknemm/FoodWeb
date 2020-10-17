import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AdminSettingsMenuComponent } from './admin-settings-menu.component';

describe('AdminSettingsMenuComponent', () => {
  let component: AdminSettingsMenuComponent;
  let fixture: ComponentFixture<AdminSettingsMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSettingsMenuComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSettingsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
