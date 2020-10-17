import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppUsernameComponent } from './app-username.component';

describe('AppUsernameComponent', () => {
  let component: AppUsernameComponent;
  let fixture: ComponentFixture<AppUsernameComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppUsernameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppUsernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
