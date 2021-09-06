import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectionStepsComponent } from './direction-steps.component';

describe('DirectionStepsComponent', () => {
  let component: DirectionStepsComponent;
  let fixture: ComponentFixture<DirectionStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectionStepsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectionStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
