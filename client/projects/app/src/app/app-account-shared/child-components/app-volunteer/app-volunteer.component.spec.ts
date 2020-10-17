import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppVolunteerComponent } from './app-volunteer.component';

describe('AppVolunteerComponent', () => {
  let component: AppVolunteerComponent;
  let fixture: ComponentFixture<AppVolunteerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppVolunteerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppVolunteerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
