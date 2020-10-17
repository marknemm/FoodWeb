import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AdminVolunteerComponent } from './admin-volunteer.component';

describe('AdminVolunteerComponent', () => {
  let component: AdminVolunteerComponent;
  let fixture: ComponentFixture<AdminVolunteerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminVolunteerComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminVolunteerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
