import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPasswordComponent } from './app-password.component';

describe('AppPasswordComponent', () => {
  let component: AppPasswordComponent;
  let fixture: ComponentFixture<AppPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
