import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FoodSafetyChecklistComponent } from './food-safety-checklist.component';

describe('FoodSafetyChecklistComponent', () => {
  let component: FoodSafetyChecklistComponent;
  let fixture: ComponentFixture<FoodSafetyChecklistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodSafetyChecklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodSafetyChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
