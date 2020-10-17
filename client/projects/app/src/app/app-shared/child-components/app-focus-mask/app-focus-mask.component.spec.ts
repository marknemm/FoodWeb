import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFocusMaskComponent } from './app-focus-mask.component';

describe('AppFocusMaskComponent', () => {
  let component: AppFocusMaskComponent;
  let fixture: ComponentFixture<AppFocusMaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppFocusMaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppFocusMaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
