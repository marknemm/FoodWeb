import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTimeRangeComponent } from './app-time-range.component';

describe('AppTimeRangeComponent', () => {
  let component: AppTimeRangeComponent;
  let fixture: ComponentFixture<AppTimeRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppTimeRangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTimeRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
