import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OperationHoursComponent } from './operation-hours.component';

describe('OperationHoursComponent', () => {
  let component: OperationHoursComponent;
  let fixture: ComponentFixture<OperationHoursComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationHoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
