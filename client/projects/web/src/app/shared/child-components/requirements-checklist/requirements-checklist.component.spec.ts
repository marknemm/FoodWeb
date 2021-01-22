import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RequirementsChecklistComponent } from './requirements-checklist.component';

describe('RequirementsChecklistComponent', () => {
  let component: RequirementsChecklistComponent;
  let fixture: ComponentFixture<RequirementsChecklistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RequirementsChecklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementsChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
