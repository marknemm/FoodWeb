import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUsernameComponent } from './app-username.component';

describe('AppUsernameComponent', () => {
  let component: AppUsernameComponent;
  let fixture: ComponentFixture<AppUsernameComponent>;

  beforeEach(async(() => {
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
