import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OperationHoursFilterComponent } from './operation-hours-filter.component';

describe('OperationHoursFilterComponent', () => {
  let component: OperationHoursFilterComponent;
  let fixture: ComponentFixture<OperationHoursFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationHoursFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationHoursFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
