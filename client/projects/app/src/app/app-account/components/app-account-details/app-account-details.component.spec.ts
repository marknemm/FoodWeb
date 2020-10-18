import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppAccountDetailsComponent } from './app-account-details.component';

describe('AppAccountDetailsComponent', () => {
  let component: AppAccountDetailsComponent;
  let fixture: ComponentFixture<AppAccountDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppAccountDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
