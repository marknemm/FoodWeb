import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AdminEventCardComponent } from './admin-event-card.component';

describe('AdminEventCardComponent', () => {
  let component: AdminEventCardComponent;
  let fixture: ComponentFixture<AdminEventCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEventCardComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminEventCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
