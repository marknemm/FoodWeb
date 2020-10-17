import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppOrganizationComponent } from './app-organization.component';

describe('AppOrganizationComponent', () => {
  let component: AppOrganizationComponent;
  let fixture: ComponentFixture<AppOrganizationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppOrganizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
