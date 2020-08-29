import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminVolunteerComponent } from './admin-volunteer.component';

describe('AdminVolunteerComponent', () => {
  let component: AdminVolunteerComponent;
  let fixture: ComponentFixture<AdminVolunteerComponent>;

  beforeEach(async(() => {
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
