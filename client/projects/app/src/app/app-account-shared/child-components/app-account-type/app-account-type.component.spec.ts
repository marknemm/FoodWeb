import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppAccountTypeComponent } from './app-account-type.component';

describe('AppAccountTypeComponent', () => {
  let component: AppAccountTypeComponent;
  let fixture: ComponentFixture<AppAccountTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppAccountTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppAccountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
