import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OperationHoursInfoComponent } from './operation-hours-info.component';

describe('OperationHoursInfoComponent', () => {
  let component: OperationHoursInfoComponent;
  let fixture: ComponentFixture<OperationHoursInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationHoursInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationHoursInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
